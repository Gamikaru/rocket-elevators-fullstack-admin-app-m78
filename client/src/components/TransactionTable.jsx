// TransactionTable.jsx
// This component is responsible for rendering the table of transactions.
// It also provides sorting and pagination functionality.
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';


const TransactionTable = ({
    transactions,
    onEdit,
    isScrollable,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    isLoading,
    searchTerm
}) => {
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });


    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) return <FaSort />;
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = transactions;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.agentName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        return [...filtered].sort((a, b) => {
            if (sortConfig.key === 'amount') {
                return sortConfig.direction === 'asc'
                    ? a.amount - b.amount
                    : b.amount - a.amount;
            }
            if (sortConfig.key === 'date') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            }
            return sortConfig.direction === 'asc'
                ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        });
    }, [transactions, searchTerm, sortConfig]);

    return (
        <div className="overflow-x-auto mt-2 mx-4">
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            <div className={`relative ${isScrollable ? 'h-[calc(100vh-240px)] overflow-y-auto' : ''}`}>
                <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
                    <thead className="bg-gray-50/90 sticky top-0 z-20 border-b border-gray-200">
                        <tr className="text-gray-700 text-sm font-bold tracking-wider uppercase">
                            <th className="w-1/4 py-5 px-6 text-center group cursor-pointer transition-all duration-200 hover:bg-gray-100/80 text-base"
                                onClick={() => handleSort('agentName')}>
                                <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                    Agent
                                    <span className="text-gray-400 group-hover:text-blue-500">{getSortIcon('agentName')}</span>
                                </span>
                            </th>
                            <th className="w-1/4 py-5 px-6 text-center group cursor-pointer transition-all duration-200 hover:bg-gray-100/80 text-base"
                                onClick={() => handleSort('amount')}>
                                <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                    Amount
                                    <span className="text-gray-400 group-hover:text-blue-500">{getSortIcon('amount')}</span>
                                </span>
                            </th>
                            <th className="w-1/4 py-5 px-6 text-center group cursor-pointer transition-all duration-200 hover:bg-gray-100/80 text-base"
                                onClick={() => handleSort('date')}>
                                <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                    Date
                                    <span className="text-gray-400 group-hover:text-blue-500">{getSortIcon('date')}</span>
                                </span>
                            </th>
                            <th className="w-1/4 py-5 px-6 text-center text-base">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-600 text-sm divide-y divide-gray-100/70">
                        {filteredAndSortedData.map(transaction => (
                            <tr key={transaction._id} className="transition-colors duration-150 hover:bg-gray-50/80 backdrop-blur-sm">
                                <td className="py-4 px-6 align-middle text-center font-medium">{transaction.agentName}</td>
                                <td className={`py-4 px-6 align-middle text-center font-medium ${transaction.amount < 1000 ? 'text-red-600 bg-red-50/40' : transaction.amount < 2000 ? 'text-yellow-600 bg-yellow-50/40' : 'text-green-600 bg-green-50/40'}`}>
                                    ${transaction.amount.toLocaleString()}
                                </td>
                                <td className="py-4 px-6 align-middle text-center">{transaction.date}</td>
                                <td className="py-4 px-6 align-middle text-center">
                                    <button onClick={() => onEdit(transaction)} className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isScrollable && (
                <div className="flex justify-between items-center mt-4 px-6">
                    <div onClick={onPrevPage} className={`text-gray-400 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}`}>
                        <FaArrowLeft size={16} />
                    </div>
                    <span className="text-gray-500 text-sm font-semibold">Page {currentPage} of {totalPages}</span>
                    <div onClick={onNextPage} className={`text-gray-400 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}`}>
                        <FaArrowRight size={16} />
                    </div>
                </div>
            )}
        </div>
    );


};


TransactionTable.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        agentName: PropTypes.string.isRequired,
    })).isRequired,
    onEdit: PropTypes.func.isRequired,
    isScrollable: PropTypes.bool.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onNextPage: PropTypes.func.isRequired,
    onPrevPage: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
};

export default TransactionTable;