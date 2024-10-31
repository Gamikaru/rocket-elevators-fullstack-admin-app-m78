// Import Outlet from react-router-dom to render child components for nested routing
import { Outlet } from "react-router-dom";
// Import Navbar component which presumably contains navigation links
import Navbar from "./components/Navbar";

// Define the App functional component
const App = () => {
    // Render the component, including the Navbar and any child components defined in the route configuration
    return (
        <div className="w-full">
            <Navbar />
            <div className="pt-16 px-6 pb-15"> {/* Ensures content starts below navbar */}
                <Outlet /> {/* Outlet acts as a placeholder that renders the child component of the current route */}
            </div>
        </div>
    );
};

// Export the App component for use in other parts of the application
export default App;