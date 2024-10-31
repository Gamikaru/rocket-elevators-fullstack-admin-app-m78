// Import useNavigate hook from react-router-dom for programmatic navigation
import { useNavigate } from 'react-router-dom';

// Define the AdminHome functional component
export default function AdminHome() {
    // Instantiate navigate function using useNavigate hook for navigating between routes
    const navigate = useNavigate();

    // Return JSX for rendering the component
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-semibold text-gray-700">Agent Management</h2>
                    <p className="mt-2 text-gray-500">Manage your agents, view stats, and more.</p>
                    <div className="mt-6 flex-center space-x-4">
                        <button
                            className="px-5 py-2 rounded-lg bg-blue-400 text-white font-medium hover:bg-blue-700 transition-transform transform hover:scale-105"
                            onClick={() => navigate('/agents')}>
                            Manage Agents
                        </button>
                        <button
                            className="px-5 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-700 transition-transform transform hover:scale-105"
                            onClick={() => navigate('/create')}>
                            Create Agent
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-semibold text-gray-700">Transactions</h2>
                    <p className="mt-2 text-gray-500">Manage & view transactions.</p>
                    <div className="mt-6 flex-center space-x-4">
                        <button
                            className="px-5 py-2 rounded-lg bg-blue-400 text-white font-medium hover:bg-blue-700 transition-transform transform hover:scale-105"
                            onClick={() => navigate('/transactions')}>
                            Transactions
                        </button>
                        <button
                            className="px-5 py-2 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-700 transition-transform transform hover:scale-105"
                            onClick={() => navigate('/reports')}>
                            Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}