// Import the necessary modules from react-router-dom
import { useNavigate } from 'react-router-dom';

// Define the Unauthorized component
const Unauthorized = () => {
    // useNavigate hook from react-router-dom allows navigation programmatically
    const navigate = useNavigate();

    // Render the component's UI
    return (
        // Container div with styling for border, rounded corners, padding, maximum width, centered, margin, and shadow
        <div className="border rounded-lg overflow-hidden p-4 max-w-sm mx-auto mt-10 bg-white shadow-lg">
            <h1 className="text-xl font-semibold text-center text-red-500">Unauthorized Access</h1>
            <p className="mt-4 text-sm text-center text-slate-700">
                You do not have permission to view this page. Please try logging in again.
            </p>
            <div className="mt-6 text-center">
                <button
                    className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate('/login')}
                >
                    Go to Login Page
                </button>
            </div>
        </div>
    );
};

// Export the Unauthorized component so it can be used elsewhere in the application
export default Unauthorized;