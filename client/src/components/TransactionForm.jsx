import PropTypes from 'prop-types';
import { useState } from 'react';

const TransactionForm = ({ agents, onSubmit, isEditing, initialValues = {} }) => {
    const [amount, setAmount] = useState(initialValues.amount || '');
    const [agentId, setAgentId] = useState(initialValues.agent_id || '');
    const [date, setDate] = useState(initialValues.date || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const amountNumber = Number(amount);
        if (!amountNumber || amountNumber <= 0) return;
        if (!agentId) return;

        const transaction = {
            amount: amountNumber,
            agent_id: agentId,
            date
        };
        onSubmit(transaction);

        if (!isEditing) {
            setAmount('');
            setAgentId('');
            setDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {isEditing ? 'Edit Transaction' : 'New Transaction'}
            </h2>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="number"
                        step="100"
                        min="100"
                        max="10000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300 shadow-sm"
                    />
                </div>

                <div className="relative">
                    <select
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm appearance-none
                                   focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300 shadow-sm
                                   bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2364748b%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.646%206.646a.5.5%200%200%201%20.708%200L8%209.293l2.646-2.647a.5.5%200%200%201%20.708.708l-3%203a.5.5%200%200%201-.708%200l-3-3a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E')]
                                   bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
                    >
                        <option value="">Select Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id} className="text-gray-700">
                                {agent.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300 shadow-sm"
                    />
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        className="w-full md:w-1/2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg
                                   transition-all duration-200 transform hover:bg-blue-600 hover:shadow-md hover:scale-[1.02]
                                   active:scale-[0.98] active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {isEditing ? 'Update' : 'Submit'}
                    </button>
                </div>
            </div>
        </form>
    );

}

TransactionForm.propTypes = {
    agents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEditing: PropTypes.bool,
    initialValues: PropTypes.shape({
        amount: PropTypes.number,
        agent_id: PropTypes.string,
        date: PropTypes.string,
    }),
};

export default TransactionForm;
