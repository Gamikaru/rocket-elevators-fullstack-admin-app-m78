// Import useNavigate hook from react-router-dom for programmatic navigation
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent Management Card */}
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-700">Agent Management</h2>
                    <p className="mt-2 text-gray-500">Manage your agents, view stats, and more.</p>
                    <div className="mt-6 flex-center space-x-4">
                        <button
                            className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                            onClick={() => navigate('/agents')}
                        >
                            Manage Agents
                        </button>
                        <button
                            className="px-5 py-2 text-sm font-medium text-green-600 bg-green-50/50 hover:bg-green-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                            onClick={() => navigate('/create')}
                        >
                            Create Agent
                        </button>
                    </div>
                </div>

                {/* Transactions Card */}
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-700">Transactions</h2>
                    <p className="mt-2 text-gray-500">Manage & view transactions.</p>
                    <div className="mt-6 flex-center space-x-4">
                        <button
                            className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                            onClick={() => navigate('/transactions')}
                        >
                            Transactions
                        </button>
                        <button
                            className="px-5 py-2 text-sm font-medium text-purple-600 bg-purple-50/50 hover:bg-purple-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                            onClick={() => navigate('/reports')}
                        >
                            Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
