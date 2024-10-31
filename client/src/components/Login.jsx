// Import hooks from React and the Link and useNavigate components from React Router
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Import useCookie hook for managing cookies
import useCookie from "react-use-cookie"; // Make sure this package is installed

// Define the Login component
const Login = () => {
    // useState hooks for managing email, password, and error message states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  // State to handle any error messages from the login process

    // useNavigate hook for programmatically navigating to other routes
    const navigate = useNavigate();

    // useCookie hook to manage the session token cookie
    const [, setSessionCookie] = useCookie('session_token', '');  // Initializes session token cookie management

    // Function to handle login process
    const handleLogin = async () => {
        try {
            // Perform a POST request to login endpoint
            const response = await fetch('http://localhost:3004/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send email and password as JSON
            });

            // Handle non-OK responses from the server
            if (!response.ok) {
                // Check if the response is JSON to parse it and extract error message
                if (response.headers.get('Content-Type')?.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Invalid login credentials. Please try again.");
                } else {
                    // Handle non-JSON responses
                    const errorText = await response.text();
                    throw new Error(errorText || "Error logging in");
                }
            }

            // Extract token and sessionToken from the JSON response
            const { token, sessionToken } = await response.json();
            // Store the JWT in localStorage for session management
            localStorage.setItem('token', token);
            // Set the session token in cookies with a path and maxAge for expiration
            setSessionCookie(sessionToken, { path: '/', maxAge: 86400 });
            // Navigate to the admin home page after successful login
            navigate('/admin-home');
        } catch (error) {
            // Set and then clear error message after 5 seconds
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };

    // The component renders a form with inputs for email and password.
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <NavLink to="/">
                        <img alt="Company Logo" className="h-12 w-auto" src="R2.png" />
                    </NavLink>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                {errorMessage && (
                    <div className="bg-red-500 text-white text-center p-3 rounded mb-4">
                        {errorMessage}
                    </div>
                )}
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                            placeholder="Password"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-400 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-4">
                        Don&apos;t have an account?{' '}
                        <NavLink to="/register" className="text-blue-400 hover:underline">
                            Register here
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;