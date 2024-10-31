// Import hooks from React and the Link component from React Router
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFileAlt, FaScroll } from "react-icons/fa"; // Icons for toggle buttons and arrows
import { Link } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal"; // Ensure this component exists separately

// Agent component responsible for rendering a single agent row in the table
const Agent = ({ agent, openModal }) => {
    const getFeeClass = (fee) => {
        if (fee < 1000) return 'bg-red-50';          // Softer red for fees below 1000
        if (fee >= 1000 && fee < 2000) return 'bg-yellow-50'; // Softer yellow for fees 1000 - 2000
        return 'bg-green-50';                         // Softer green for fees 2000 and above
    };

    return (
        <tr className="border-b transition-colors hover:bg-gray-50">
            <td className="py-4 px-6 text-left align-middle">
                {`${agent.first_name.charAt(0).toUpperCase()}${agent.first_name.slice(1)} ${agent.last_name.charAt(0).toUpperCase()}${agent.last_name.slice(1)}`}
            </td>
            <td className="py-4 px-6 text-right align-middle">{agent.region}</td>
            <td className="py-4 px-6 text-right align-middle">{agent.rating}</td>
            <td className={`py-4 px-6 text-right align-middle ${getFeeClass(agent.fee)}`}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(agent.fee)}
            </td>
            <td className="py-4 px-6 text-left align-middle">
                <div className="flex gap-2">
                    <Link
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-100 hover:bg-gray-200 rounded-md px-3 h-9"
                        to={`/edit/${agent._id}`}
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => openModal(agent._id)}
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-blue-300 hover:bg-blue-400 hover:text-accent-foreground rounded-md px-3 h-9"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

// PropTypes validation for Agent component
Agent.propTypes = {
    agent: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        fee: PropTypes.number.isRequired,
    }).isRequired,
    openModal: PropTypes.func.isRequired,
};

export default function AgentList() {
    const [agents, setAgents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAgentId, setCurrentAgentId] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [isScrollable, setIsScrollable] = useState(false); // View toggle state
    const agentsPerPage = isScrollable ? 20 : 5;

    // Fetch agents data on component mount
    useEffect(() => {
        const fetchAgents = async () => {
            const response = await fetch(`http://localhost:3004/agents`);
            if (response.ok) {
                const agents = await response.json();
                setAgents(agents);
            } else {
                console.error(`Failed to fetch agents: ${response.statusText}`);
            }
        };
        fetchAgents();
    }, []);

    const openModal = (agentId) => {
        setCurrentAgentId(agentId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3004/agents/${currentAgentId}`, { method: "DELETE" });
            if (!response.ok) throw new Error(`Failed to delete agent, status code: ${response.status}`);
            setAgents(agents.filter(agent => agent._id !== currentAgentId));
            setNotification({ message: "Agent deleted successfully!", type: "success" });
        } catch (error) {
            setNotification({ message: `Error deleting agent: ${error.message}`, type: "error" });
        } finally {
            closeModal();
            setTimeout(() => setNotification({ message: "", type: "" }), 5000);
        }
    };

    // Pagination logic
    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);

    const totalPages = Math.ceil(agents.length / agentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const toggleView = () => {
        setIsScrollable(!isScrollable);
        setCurrentPage(1); // Reset to first page on view toggle
    };

    return (
        <>
            {/* Header with View Toggle and Create Button */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl px-6 font-bold text-gray-800">Agent List</h2>
                <div className="flex items-center space-x-4 px-6">
                    <div
                        onClick={toggleView}
                        className="text-gray-600 px-8 hover:text-gray-300 cursor-pointer transition"
                    >
                        {isScrollable ? <FaFileAlt size={20} /> : <FaScroll size={20} />}
                    </div>
                    <Link
                        to="/create"
                        className="inline-flex px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                    >
                        Create Agent
                    </Link>
                </div>
            </div>

            {/* Notification */}
            {notification.message && (
                <div
                    className={`mt-4 mx-6 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    role="alert"
                >
                    {notification.message}
                </div>
            )}

            {/* Agents table with toggled view */}
            <div className="overflow-x-auto mt-6 mx-6">
                <div className={`relative ${isScrollable ? 'h-96 overflow-y-auto' : ''}`} style={{ scrollBehavior: "smooth" }}>
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr className="text-left text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-right">Region</th>
                                <th className="py-3 px-6 text-right">Rating</th>
                                <th className="py-3 px-6 text-right">Fee</th>
                                <th className="py-3 px-6 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {currentAgents.map((agent) => (
                                <Agent key={agent._id} agent={agent} openModal={openModal} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!isScrollable && (
                    <div className="flex justify-between items-center mt-4 px-6">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="inline-flex items-center px-4 py-2 bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            <FaArrowLeft size={20} />
                        </button>
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center px-4 py-2 bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            <FaArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={confirmDelete}
                    message="Are you sure you want to delete this agent?"
                />
            )}
        </>
    );
}
