// Import React for building the user interface
import React from 'react';
// Import createRoot function to enable the new React 18 root API
import { createRoot } from 'react-dom/client';
// Import routing components from react-router-dom to handle navigation within the app
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom';
// Import various component files to be used in routing
import App from './App';
import AdminHome from './components/AdminHome';
import Agent from './components/Agent';
import AgentList from './components/AgentList';
import Login from './components/Login';
import RegistrationWrapper from './components/RegistrationWrapper';
import Report from './components/Report';
import Transactions from './components/Transactions';
import Unauthorized from './components/Unauthorized';
// Import global styles for the application
// import './index.css';
// Import the App.css file for global styles
import './App.css';
// Import PropTypes for prop type validation
import PropTypes from 'prop-types';

// Define a ProtectedRoute component to handle protected routes
const ProtectedRoute = ({ children }) => {
    // Retrieve the authentication token from local storage to check if the user is authenticated
    const isAuthenticated = localStorage.getItem('token');
    // Get the current location using useLocation hook
    const location = useLocation();

    // Check if the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register") {
        return <Navigate to="/unauthorized" replace />;
    }

    // Render the child components if the user is authenticated
    return children;
};

// Define prop types for the ProtectedRoute component
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

// Create a router instance with route definitions using createBrowserRouter
const router = createBrowserRouter([
    {
        path: "/",  // Root route
        element: <App />,  // Main layout or component that wraps other components
        children: [  // Nested routes within the main layout
            {
                index: true,  // Default child route
                element: <Navigate to="/login" replace />,  // Redirects to the login page
            },
            {
                path: "admin-home",  // Admin home page route
                element: <ProtectedRoute><AdminHome /></ProtectedRoute>,  // Protected route for admin home
            },
            {
                path: "agents",  // Agents list route
                element: <ProtectedRoute><AgentList /></ProtectedRoute>,  // Protected route for agents list
            },
            {
                path: "edit/:id",  // Edit agent details route
                element: <ProtectedRoute><Agent /></ProtectedRoute>,  // Protected route for editing an agent
            },
            {
                path: "create",  // Create new agent route
                element: <ProtectedRoute><Agent /></ProtectedRoute>,  // Protected route for creating an agent
            },
            {
                path: "transactions",  // Transactions route
                element: <ProtectedRoute><Transactions /></ProtectedRoute>,  // Protected route for transactions
            },
            {
                path: "reports",  // Reports route
                element: <ProtectedRoute><Report /></ProtectedRoute>,  // Protected route for viewing reports
            },
        ],
    },
    {
        path: "/login",  // Login page route
        element: <Login />,  // Login component
    },
    {
        path: "/register",  // Registration page route
        element: <RegistrationWrapper />,  // Registration component
    },
    {
        path: "/unauthorized",  // Unauthorized access route
        element: <Unauthorized />,  // Unauthorized component
    },
]);

// Create the root container where the React app attaches
const root = createRoot(document.getElementById('root'));
// Render the RouterProvider passing the configured router, enabling route management in React
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);