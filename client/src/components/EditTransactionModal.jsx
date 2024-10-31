// EditTransactionModal.js
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const EditTransactionModal = ({ isOpen, transaction, agents, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    const [agent_id, setAgentId] = useState(''); // Use agent_id consistently
    const [date, setDate] = useState('');

    // Set initial values from transaction prop when modal opens
    useEffect(() => {
        if (transaction) {
            setAmount(Number(transaction.amount));
            setAgentId(transaction.agent_id); // Use agent_id here
            setDate(transaction.date);
        }
    }, [transaction]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedTransaction = {
            amount: Number(amount),
            agent_id, // Pass agent_id to match backend expectation
            date
        };
        console.log("Submitting updated values:", updatedTransaction);
        onSave(updatedTransaction); // Pass the updated transaction to the parent
        onClose(); // Close modal
    };

    if (!isOpen) return null; // Return null if modal isn't open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Agent</label>
                        <select
                            value={agent_id} // Use agent_id in form value
                            onChange={(e) => setAgentId(e.target.value)}
                            required
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Agent</option>
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditTransactionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    transaction: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        agent_id: PropTypes.string, // Remove 'isRequired' to make it optional
        date: PropTypes.string.isRequired,
    }),
    agents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

// Default props
EditTransactionModal.defaultProps = {
    transaction: {
        agent_id: '', // Default to empty string if agent_id is not provided
    },
};

export default EditTransactionModal;
