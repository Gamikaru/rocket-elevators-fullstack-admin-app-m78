// Import hooks
import { useState } from 'react';
// Import NavLink for navigation links and useNavigate for programmatic navigation
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';

// Define the Register component
const Register = () => {
    // State hooks for storing form inputs and messages
    const [firstName, setFirstName] = useState(''); // Store first name
    const [lastName, setLastName] = useState(''); // Store last name
    const [email, setEmail] = useState(''); // Store email
    const [password, setPassword] = useState(''); // Store password
    const [error, setError] = useState(''); // Store error messages
    const [successMessage, setSuccessMessage] = useState(''); // Store success messages
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Function to validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Function to validate password requirements
    const validatePassword = (password) => {
        const minLength = 8;
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        return password.length >= minLength && hasSpecialChar;
    };

    // Function to validate name for allowed characters
    const validateName = (name) => {
        const re = /^[A-Za-z\-']+$/;
        return re.test(name);
    };

    // Utility function to display messages with a timeout
    const setMessageWithTimeout = (messageSetter, message) => {
        messageSetter(message);
        setTimeout(() => messageSetter(''), 5000);
    };

    // Handler for form submission and registration process
    const handleRegister = async () => {
        // Validate first and last names
        if (!validateName(firstName) || !validateName(lastName)) {
            setMessageWithTimeout(setError, "Names can only contain letters, apostrophes, and hyphens.");
            return;
        }
        // Validate email
        if (!validateEmail(email)) {
            setMessageWithTimeout(setError, "Invalid email format.");
            return;
        }
        // Validate password
        if (!validatePassword(password)) {
            setMessageWithTimeout(setError, "Password must be at least 8 characters and include a special character from '!@#$%^&*'.");
            return;
        }

        // Try to register the user using a POST request
        try {
            const response = await fetch('http://localhost:3004/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                }),
            });

            const contentType = response.headers.get('content-type');
            let errorData;
            // Check if the response is JSON and parse it, otherwise handle as plain text
            if (contentType && contentType.indexOf('application/json') !== -1) {
                errorData = await response.json();
            } else {
                errorData = { error: await response.text() || 'Registration failed. Please try again.' };
            }

            // Handle non-ok responses by throwing an error
            if (!response.ok) {
                throw new Error(errorData.error || 'Registration failed');
            }

            // Display success message and navigate after a delay
            setMessageWithTimeout(setSuccessMessage, 'Registration successful. Please log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessageWithTimeout(setError, error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <NavLink to="/">
                        <img alt="Company Logo" className="h-12 w-auto" src="R2.png" />
                    </NavLink>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
                {error && (
                    <div className="bg-red-500 text-white text-center p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-500 text-white text-center p-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}
                <form className="space-y-6 px-5" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <div>
                        {/* <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label> */}
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label> */}
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label> */}
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label> */}
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-20 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"                    >
                        Register
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-4">
                        Already have an account?{' '}
                        <NavLink to="/login" className="text-blue-400 hover:underline">
                            Back to Login
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
};

// PropTypes validation for Register component
Register.propTypes = {
    onRegisterSuccess: PropTypes.func,
};

export default Register;