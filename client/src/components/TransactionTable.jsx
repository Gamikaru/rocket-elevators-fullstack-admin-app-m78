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
        <div className="overflow-x-auto mt-4 mx-6">
            <div className={`relative ${isScrollable ? 'h-[calc(100vh-280px)] overflow-y-auto' : ''}`}>
                {isLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    </div>
                )}
                <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-100">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="text-gray-500 text-xs tracking-wider">
                            <th
                                className="w-1/4 py-3 px-3 text-center group cursor-pointer transition-colors hover:bg-gray-100"
                                onClick={() => handleSort('agentName')}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Agent
                                    <span className="text-gray-300 group-hover:text-gray-400">
                                        {getSortIcon('agentName')}
                                    </span>
                                </span>
                            </th>
                            <th
                                className="w-1/4 py-3 px-3 text-center group cursor-pointer transition-colors hover:bg-gray-100"
                                onClick={() => handleSort('amount')}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Amount
                                    <span className="text-gray-300 group-hover:text-gray-400">
                                        {getSortIcon('amount')}
                                    </span>
                                </span>
                            </th>
                            <th
                                className="w-1/4 py-3 px-3 text-center group cursor-pointer transition-colors hover:bg-gray-100"
                                onClick={() => handleSort('date')}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Date
                                    <span className="text-gray-300 group-hover:text-gray-400">
                                        {getSortIcon('date')}
                                    </span>
                                </span>
                            </th>
                            <th className="w-1/4 py-3 px-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
                        {filteredAndSortedData.map(transaction => (
                            <tr
                                key={transaction._id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                                    {transaction.agentName}
                                </td>
                                <td className={`py-3 px-3 align-middle text-center whitespace-nowrap ${transaction.amount < 1000
                                    ? 'text-red-600 bg-red-50/30'
                                    : transaction.amount < 2000
                                        ? 'text-yellow-600 bg-yellow-50/30'
                                        : 'text-green-600 bg-green-50/30'
                                    }`}>
                                    ${transaction.amount.toLocaleString()}
                                </td>
                                <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                                    {transaction.date}
                                </td>
                                <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                                    <button
                                        onClick={() => onEdit(transaction)}
                                        className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors text-sm font-medium"
                                    >
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
                    <div
                        onClick={onPrevPage}
                        className={`
                            text-gray-400 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer
                            ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}
                        `}
                    >
                        <FaArrowLeft size={14} />
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div
                        onClick={onNextPage}
                        className={`
                            text-gray-400 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer
                            ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}
                        `}
                    >
                        <FaArrowRight size={14} />
                    </div>
                </div>
            )}
        </div>
    );
}

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