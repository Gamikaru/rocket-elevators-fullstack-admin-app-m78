import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50/50
                       hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            onClick={handleLogout}
        >
            Sign Out
        </button>
    );
};

export default LogoutButton;
