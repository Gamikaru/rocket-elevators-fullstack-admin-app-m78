// import the necessary dependencies
import { useNavigate } from 'react-router-dom';

// LogoutButton component to handle user logout functionality.
const LogoutButton = () => {
    const navigate = useNavigate();
    // handleLogout function to remove the token from local storage and navigate to the login page.
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // The component renders a button that calls the handleLogout function on click.
    return (
        <button
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-700 transition"
            onClick={handleLogout}
        >
            Sign Out
        </button>
    );
};

export default LogoutButton;