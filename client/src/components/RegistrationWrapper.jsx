
// Import useNavigate from 'react-router-dom' for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import Register component, which handles the user registration form
import Register from './Registration';

// Define the RegistrationWrapper component
function RegistrationWrapper() {
    // useNavigate hook to programatically navigate the user after actions
    let navigate = useNavigate();

    // Define onRegisterSuccess function that navigates the user to the login page
    function onRegisterSuccess() {
        navigate('/login'); // Navigates to the login page
    }

    // Render the Register component and pass onRegisterSuccess as a prop to handle successful registration
    return <Register onRegisterSuccess={onRegisterSuccess} />;
}

// Export RegistrationWrapper for use in other parts of the application
export default RegistrationWrapper;
