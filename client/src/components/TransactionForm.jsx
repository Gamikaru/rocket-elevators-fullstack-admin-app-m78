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

        // Reset form if not editing
        if (!isEditing) {
            setAmount('');
            setAgentId('');
            setDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-4">
                <div>

                    <input
                        type="number"
                        step="100"
                        min="100"
                        max="10000"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>

                    <select
                        value={agentId}
                        onChange={e => setAgentId(e.target.value)}
                        required
                        className="w-full custom-select px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                >
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            </div>
        </form>
    );
};

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