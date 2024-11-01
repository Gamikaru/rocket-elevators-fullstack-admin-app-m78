import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFileAlt, FaFilter, FaScroll, FaSearch, FaSort, FaSortDown, FaSortUp, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

const Agent = ({ agent, openModal }) => {
    const getFeeClass = (fee) => {
        if (fee < 1000) return 'text-red-600 bg-red-50/40';
        if (fee >= 1000 && fee < 2000) return 'text-yellow-600 bg-yellow-50/40';
        return 'text-green-600 bg-green-50/40';
    };

    return (
        <tr className="transition-colors duration-150 hover:bg-gray-50/80 backdrop-blur-sm">
            <td className="py-4 px-6 text-center font-medium">{agent.first_name} {agent.last_name}</td>
            <td className="py-4 px-6 text-center font-medium">{agent.region}</td>
            <td className="py-4 px-6 text-center font-medium">{agent.rating}</td>
            <td className={`py-4 px-6 text-center font-medium ${getFeeClass(agent.fee)}`}>
                ${agent.fee.toLocaleString()}
            </td>
            <td className="py-4 px-6 text-center">
                <div className="flex justify-center gap-2">
                    <Link
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50
                                 hover:bg-blue-100 rounded-lg transition-all duration-200
                                 hover:shadow-md hover:scale-105 active:scale-95"
                        to={`/edit/${agent._id}`}
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => openModal(agent._id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50/50
                                 hover:bg-red-100 rounded-lg transition-all duration-200
                                 hover:shadow-md hover:scale-105 active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

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
    const [isScrollable, setIsScrollable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'last_name', direction: 'asc' });
    const [regionFilter, setRegionFilter] = useState('');
    const [isRegionFilterVisible, setIsRegionFilterVisible] = useState(false);
    const agentsPerPage = isScrollable ? 20 : 5;

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

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) return <FaSort />;
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = agents;

        if (searchTerm) {
            filtered = filtered.filter(agent =>
                `${agent.first_name} ${agent.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (regionFilter) {
            filtered = filtered.filter(agent => agent.region === regionFilter);
        }

        return [...filtered].sort((a, b) => {
            const aVal = a[sortConfig.key] || '';
            const bVal = b[sortConfig.key] || '';
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        });
    }, [agents, searchTerm, regionFilter, sortConfig]);

    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAndSortedData.slice(indexOfFirstAgent, indexOfLastAgent);
    const totalPages = Math.ceil(filteredAndSortedData.length / agentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const toggleView = () => {
        setIsScrollable(!isScrollable);
        setCurrentPage(1);
    };

    const handleRegionFilterChange = (e) => {
        setRegionFilter(e.target.value);
        setIsRegionFilterVisible(false);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                    <h2 className="text-3xl font-semibold mb-1">Agents</h2>
                    <p className="text-gray-500">Manage and view all agents efficiently</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div
                        onClick={toggleView}
                        className="p-3 rounded-full cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 ease-in-out"
                    >
                        {isScrollable ? <FaFileAlt size={20} /> : <FaScroll size={20} />}
                    </div>
                    <div
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        className="p-3 rounded-full cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 ease-in-out"
                    >
                        <FaSearch size={20} />
                    </div>
                    <div
                        className={`relative ${isSearchVisible ? 'w-80 opacity-100 scale-100' : 'w-0 opacity-0 scale-95'}
                        transition-all duration-300 ease-in-out origin-left`}
                    >
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                        {searchTerm && (
                            <FaTimes
                                className="absolute right-3 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => setSearchTerm('')}
                            />
                        )}
                    </div>
                    <Link
                        to="/create"
                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50/50
                                 hover:bg-green-100 rounded-lg transition-all duration-200
                                 hover:shadow-md hover:scale-105 active:scale-95"
                    >
                        Create Agent
                    </Link>
                </div>
            </div>

            {notification.message && (
                <div
                    className={`mt-4 mx-6 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    role="alert"
                >
                    {notification.message}
                </div>
            )}

            <div className="overflow-x-auto mt-2 mx-4">
                <div className={`relative ${isScrollable ? 'h-[calc(100vh-240px)] overflow-y-auto' : ''}`}>
                    <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
                        <thead className="bg-gray-50/90 sticky top-0 z-20 border-b border-gray-200">
                            <tr className="text-gray-700 text-sm font-bold tracking-wider uppercase">
                                <th className="py-4 px-6 text-center group cursor-pointer" onClick={() => handleSort('last_name')}>
                                    <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                        Name
                                        <span className="text-gray-400 group-hover:text-blue-500">{getSortIcon('last_name')}</span>
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-center group cursor-pointer relative">
                                    <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                        Region
                                        <FaFilter
                                            className="ml-2 text-gray-400 cursor-pointer hover:text-blue-500"
                                            onClick={() => setIsRegionFilterVisible(!isRegionFilterVisible)}
                                        />
                                    </span>
                                    {isRegionFilterVisible && (
                                        <select
                                            value={regionFilter}
                                            onChange={handleRegionFilterChange}
                                            className="absolute top-12 left-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm hover:shadow-md transition w-40"
                                        >
                                            <option value="">All Regions</option>
                                            {[...new Set(agents.map(agent => agent.region))].map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    )}
                                </th>
                                <th className="py-4 px-6 text-center group cursor-pointer" onClick={() => handleSort('rating')}>
                                    <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                        Rating
                                        <span className="text-gray-400 group-hover:text-blue-500">{getSortIcon('rating')}</span>
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-center group cursor-pointer" onClick={() => handleSort('fee')}>
                                    <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                        Fee
                                        <span className="text-gray-400 group-hover:text-blue-500">{getSortIcon('fee')}</span>
                                    </span>
                                </th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm divide-y divide-gray-100/70">
                            {currentAgents.map(agent => (
                                <Agent key={agent._id} agent={agent} openModal={openModal} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {!isScrollable && (
                    <div className="flex justify-between items-center mt-4 px-6">
                        <div
                            onClick={handlePreviousPage}
                            className={`text-gray-400 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}`}
                        >
                            <FaArrowLeft size={16} />
                        </div>
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div
                            onClick={handleNextPage}
                            className={`text-gray-400 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}`}
                        >
                            <FaArrowRight size={16} />
                        </div>
                    </div>
                )}
            </div>

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