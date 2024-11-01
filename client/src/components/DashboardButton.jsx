import { useNavigate } from 'react-router-dom';

const DashboardButton = () => {
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate('/admin-home');
    };

    return (
        <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50
                       hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            onClick={navigateToDashboard}
        >
            Return to Dashboard
        </button>
    );
};

export default DashboardButton;
