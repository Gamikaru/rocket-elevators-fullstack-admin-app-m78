// The dashboard button only shows in the navbar when the user is not on the admin home page.

// import the necessary dependencies
import { useNavigate } from 'react-router-dom';

// DashboardReturn component to handle user navigation back to the dashboard page.
const DashboardButton = () => {
    const navigate = useNavigate();
    // navigateToDashboard function to navigate the user back to the dashboard page.
    const navigateToDashboard = () => {
        navigate('/admin-home');
    };

    // The component renders a button with an onClick event that calls the navigateToDashboard function.
    return (
        <button
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={navigateToDashboard}
        >
            Return to Dashboard
        </button>
    );
};

export default DashboardButton;