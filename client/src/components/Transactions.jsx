// Import React and its hooks to use in the component
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaFileAlt, FaScroll } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import EditTransactionModal from './EditTransactionModal'; // Import the edit modal component

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [agents, setAgents] = useState([]);
    const [amount, setAmount] = useState('');
    const [agentId, setAgentId] = useState('');
    const [date, setDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [isScrollable, setIsScrollable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = isScrollable ? 20 : 5;
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Fetch transaction and agent data
    useEffect(() => {
        fetch('http://localhost:3004/transactions/transaction-data')
            .then(res => res.ok ? res.json() : Promise.reject('Failed to load'))
            .then(data => {
                if (data.status === "ok") {
                    const formattedAgents = data.data.agents.map(agent => ({
                        id: agent._id.toString(),
                        name: `${agent.first_name} ${agent.last_name}`
                    }));
                    const updatedTransactions = data.data.transactions.map(tr => ({
                        ...tr,
                        date: new Date(tr.date).toLocaleDateString(),
                        agentName: tr.agent_id ? `${tr.agent_id.first_name} ${tr.agent_id.last_name}` : 'No agent assigned'
                    }));
                    setAgents(formattedAgents);
                    setTransactions(updatedTransactions);
                } else throw new Error("Data format incorrect");
            })
            .catch(() => alert("Failed to load transactions. Please try again later."));
        return () => {
            sessionStorage.removeItem('pendingTransaction');
        };
    }, []);

    // Handle edit modal opening
    const handleEdit = (transaction) => {
        const editData = {
            amount: Number(transaction.amount),
            agent_id: transaction.agent_id ? transaction.agent_id._id.toString() : '',
            date: new Date(transaction.date).toISOString().split('T')[0],
        };
        setAmount(editData.amount);
        setAgentId(editData.agent_id);
        setDate(editData.date);
        setEditTransactionId(transaction._id);
        setIsEditModalOpen(true);
        // Store the edit data
        sessionStorage.setItem('pendingTransaction', JSON.stringify(editData));
    };

    // Updated handleSaveTransaction to pass data directly to confirmTransaction
    const handleSaveTransaction = (updatedTransaction) => {
        confirmTransaction(updatedTransaction); // Pass updated transaction directly
    };

    // Modify confirmTransaction to accept parameters
    const confirmTransaction = () => {
        // Retrieve stored transaction data
        const transaction = JSON.parse(sessionStorage.getItem('pendingTransaction'));
        if (!transaction) return;

        setIsLoading(true);
        const url = editTransactionId
            ? `http://localhost:3004/transactions/transaction/${editTransactionId}`
            : 'http://localhost:3004/transactions/transaction';
        const method = editTransactionId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        })
            .then(res => res.ok ? res.json() : Promise.reject('Failed to submit'))
            .then(() => {
                // Clear stored transaction data
                sessionStorage.removeItem('pendingTransaction');
                return fetch('http://localhost:3004/transactions/transaction-data');
            })
            .then(res => res.json())
            .then(latestData => {
                // Map transactions with agent details
                const updatedTransactions = latestData.data.transactions.map(tr => {
                    const agent = latestData.data.agents.find(a => a._id === tr.agent_id._id);
                    return {
                        ...tr,
                        date: new Date(tr.date).toLocaleDateString(),
                        agentId: tr.agent_id._id,
                        agentName: agent ? `${agent.first_name} ${agent.last_name}` : 'No agent assigned'
                    };
                });
                setTransactions(updatedTransactions);
                setAgents(latestData.data.agents);
                setNotification({ message: 'Transaction updated successfully!', type: 'success' });
            })
            .catch(err => {
                console.error('Error:', err);
                setNotification({ message: err.toString(), type: 'error' });
            })
            .finally(() => {
                setIsLoading(false);
                setAmount('');
                setAgentId('');
                setDate('');
                setEditTransactionId(null);
                setIsModalOpen(false);
                setIsEditModalOpen(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const amountNumber = Number(amount);
        if (!amountNumber || amountNumber <= 0) {
            setNotification({ message: 'Amount must be a positive number.', type: 'error' });
            return;
        }
        if (!agentId) {
            setNotification({ message: 'Please select an agent.', type: 'error' });
            return;
        }
        const transaction = {
            amount: amountNumber,
            agent_id: agentId,
            date: date
        };
        setIsModalOpen(true);
        // Store the transaction data for confirmation
        sessionStorage.setItem('pendingTransaction', JSON.stringify(transaction));
    };

    // Pagination Logic
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

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

    // Define row color based on transaction amount
    const getRowClass = (amount) => {
        if (amount < 1000) return 'bg-red-100/50';
        if (amount >= 1000 && amount < 2000) return 'bg-yellow-100/50';
        return 'bg-green-100/50';
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl px-8 font-bold text-gray-800">Transactions</h1>
                <div
                    onClick={toggleView}
                    className="text-gray-600 px-8 hover:text-gray-300 cursor-pointer transition"
                >
                    {isScrollable ? <FaFileAlt size={20} /> : <FaScroll size={20} />}
                </div>
            </div>
            {notification.message && (
                <div className={`mt-4 mx-6 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`} role="alert">
                    {notification.message}
                </div>
            )}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    sessionStorage.removeItem('pendingTransaction');
                }}
                onConfirm={confirmTransaction}
                message="Are you sure you want to submit this transaction?"
            />
            <EditTransactionModal
                isOpen={isEditModalOpen}
                transaction={{ amount: Number(amount), agentId: agentId.toString(), date }} // Ensure agentId is a string
                agents={agents}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveTransaction}
            />
            <div className="overflow-x-auto mt-6 mx-6">
                <div className={`relative ${isScrollable ? 'h-96 overflow-y-auto' : ''}`} style={{ scrollBehavior: "smooth" }}>
                    {isLoading && (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr className="text-left text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-right">Amount</th>
                                <th className="py-3 px-6 text-right">Agent</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {currentTransactions.map(transaction => (
                                <tr key={transaction._id} className={`${getRowClass(transaction.amount)} border-b`}>
                                    <td className="py-3 px-6 align-middle text-left">
                                        {transaction.date}
                                    </td>
                                    <td className="py-3 px-6 align-middle text-right">
                                        ${transaction.amount.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-6 align-middle text-right">
                                        {transaction.agentName}
                                    </td>
                                    <td className="py-3 px-6 align-middle text-left">
                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="text-blue-500 hover:text-blue-700 transition"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
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
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="number" step="100" min="100" max="10000"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-md w-full md:w-60"
                    />
                    <select
                        value={agentId}
                        onChange={e => setAgentId(e.target.value)}
                        required
                        className="custom-select px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{`${agent.name} (ID: ${agent.id})`}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-md w-full md:w-60"
                    />
                    <button
                        type="submit"
                        className="text-white bg-blue-400 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        {editTransactionId ? 'Update Transaction' : 'Submit Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Transactions;
