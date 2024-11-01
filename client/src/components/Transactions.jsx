import { useEffect, useState } from 'react';
import { FaFileAlt, FaInfoCircle, FaScroll, FaSearch, FaTimes } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import EditTransactionModal from './EditTransactionModal';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';


const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [agents, setAgents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "", visible: false });
    const [isScrollable, setIsScrollable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = isScrollable ? 20 : 5;
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        fetchTransactionData();
        return () => {
            sessionStorage.removeItem('pendingTransaction');
        };
    }, []);

    const fetchTransactionData = () => {
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
                        date: new Date(tr.date).toISOString().split('T')[0],
                        agentName: tr.agent_id ? `${tr.agent_id.first_name} ${tr.agent_id.last_name}` : 'No agent assigned'
                    }));

                    updatedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

                    setAgents(formattedAgents);
                    setTransactions(updatedTransactions);
                    setCurrentPage(1);
                } else throw new Error("Data format incorrect");
            })
            .catch(() => showToast("Failed to load transactions. Please try again later.", "error"));
    };

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => hideToast(), 3000);
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    const handleEdit = (transaction) => {
        const editData = {
            amount: Number(transaction.amount),
            agent_id: transaction.agent_id ? transaction.agent_id._id.toString() : '',
            date: new Date(transaction.date).toISOString().split('T')[0],
        };
        setSelectedTransaction(editData);
        setEditTransactionId(transaction._id);
        setIsEditModalOpen(true);
        sessionStorage.setItem('pendingTransaction', JSON.stringify(editData));
    };

    const handleSaveTransaction = (updatedTransaction) => {
        sessionStorage.setItem('pendingTransaction', JSON.stringify(updatedTransaction));
        confirmTransaction();
    };

    const handleCreateTransaction = (transaction) => {
        sessionStorage.setItem('pendingTransaction', JSON.stringify(transaction));
        setIsModalOpen(true);
    };

    const confirmTransaction = () => {
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
                sessionStorage.removeItem('pendingTransaction');
                return fetchTransactionData();
            })
            .then(() => showToast(`Transaction ${editTransactionId ? 'updated' : 'created'} successfully!`, 'success'))
            .catch(err => showToast(err.toString(), 'error'))
            .finally(() => {
                setIsLoading(false);
                setEditTransactionId(null);
                setIsModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedTransaction(null);
            });
    };

    const toggleView = () => {
        setIsScrollable(!isScrollable);
        setCurrentPage(1);
    };

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    return (
        <div className="max-w-6xl mx-auto pt-2 px-6">
            {/* Title Section */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                    <h2 className="text-3xl font-semibold flex items-center mb-1">
                        Transactions
                        <FaInfoCircle
                            className="ml-2 text-gray-400 cursor-pointer hover:text-blue-600 transition duration-200"
                            title="View information about transactions"
                        />
                    </h2>
                    <p className="text-gray-500">Manage and view all agent transactions efficiently</p>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Table column */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-start mb-4 px-4 lg:px-0">
                        <div className="flex items-center space-x-2">
                            {/* Toggle View Icon */}
                            <div
                                onClick={toggleView}
                                className="p-3 rounded-full cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 ease-in-out"
                            >
                                {isScrollable ? <FaFileAlt className="w-5 h-5" /> : <FaScroll className="w-5 h-5" />}
                            </div>

                            {/* Toggle Search Icon */}
                            <div
                                onClick={() => setIsSearchVisible(!isSearchVisible)}
                                className="p-3 rounded-full cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 ease-in-out"
                            >
                                <FaSearch className="w-5 h-5" />
                            </div>

                            {/* Search Input with Smooth Animation */}
                            <div
                                className={`relative overflow-hidden transition-all duration-300 ease-in-out ${isSearchVisible ? 'w-64 opacity-100 scale-100' : 'w-0 opacity-0 scale-95'}`}
                            >
                                <input
                                    type="text"
                                    placeholder="Search by agent name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition duration-200"
                                />
                                {searchTerm && (
                                    <FaTimes
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                                        onClick={() => setSearchTerm('')}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <TransactionTable
                        transactions={currentTransactions}
                        searchTerm={searchTerm}
                        onEdit={handleEdit}
                        isScrollable={isScrollable}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isLoading={isLoading}
                    />
                </div>

                {/* Form column */}
                <div className="lg:col-span-1 mt-10">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm mx-auto mt-10">
                        <TransactionForm
                            agents={agents}
                            onSubmit={handleCreateTransaction}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmTransaction}
                message="Are you sure you want to submit this transaction?"
            />

            <EditTransactionModal
                isOpen={isEditModalOpen}
                transaction={selectedTransaction}
                agents={agents}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveTransaction}
            />

            {toast.visible && (
                <div className={`fixed bottom-4 right-4 bg-${toast.type === 'success' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded-lg shadow-md`}>
                    {toast.message}
                </div>
            )}
        </div>
    );

}

export default Transactions;
