// Import necessary hooks and components from React Router and React
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import DashboardButton from "./DashboardButton"; // Custom button component for navigating to the dashboard
import LogoutButton from "./LogoutButton"; // Custom button component for logging out

// Define the Navbar component
export default function Navbar() {
    const [showToast, setShowToast] = useState(false);
    const location = useLocation();
    const [isDashboard, setIsDashboard] = useState(false);
    const [showDashboardButton, setShowDashboardButton] = useState(false);

    // Effect to check if the user is on the dashboard
    useEffect(() => {
        setIsDashboard(location.pathname === "/admin-home");
    }, [location]);

    // Effect to control dashboard button visibility
    useEffect(() => {
        setShowDashboardButton(!isDashboard);
    }, [isDashboard]);

    // Show toast when hovering over logo, if not on the dashboard
    const handleMouseEnter = () => {
        if (location.pathname !== "/admin-home") {
            setShowToast(true);
        }
    };

    const handleMouseLeave = () => {
        setShowToast(false);
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div className="flex items-center relative">
                    <NavLink
                        to="/admin-home"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Added the .logo class to apply styles */}
                        <img src="/R2.png" alt="Logo" className="logo h-8 w-auto" />
                    </NavLink>
                    {showToast && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg shadow-lg transition-opacity duration-300">
                            Dashboard
                        </div>
                    )}
                </div>
                {/* Navigation Buttons */}
                <div className="flex items-center space-x-4">
                    {showDashboardButton && <DashboardButton />}
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}