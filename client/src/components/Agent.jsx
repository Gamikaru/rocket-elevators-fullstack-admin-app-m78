// Import React library and necessary hooks
import { useCallback, useEffect, useState } from "react";
// Import useParams for accessing route parameters and useNavigate for programmatic navigation
import { useNavigate, useParams } from "react-router-dom";
// Import the ConfirmationModal component, make sure it's correctly imported
import ConfirmationModal from "./ConfirmationModal";

// Define the Agent component
export default function Agent() {
    // State for the form fields
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        region: "",
        rating: "",
        fee: "",
    });
    // State to track if the current operation is creating a new agent
    const [isNew, setIsNew] = useState(true);
    // State to control the visibility of the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State for handling notifications like errors or success messages
    const [notification, setNotification] = useState({ message: "", type: "" });
    // Hook to access route parameters
    const params = useParams();
    // Hook for navigation
    const navigate = useNavigate();

    // Fetch data for an agent
    const fetchData = useCallback(async (id) => {
        const url = `http://localhost:3004/agents/${id}`;
        try {
            const response = await fetch(url); // Make a fetch request to get data
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.statusText}`);
            const agent = await response.json(); // Parse JSON response
            setForm(agent); // Set form state with fetched data
        } catch (error) {
            console.error("Fetch error:", error);
            setNotification({ message: "Failed to fetch agent data.", type: "error" });
            setTimeout(() => { setNotification({ message: "", type: "" }); }, 7000);
        }
    }, []);

    // useEffect to fetch existing agent data or reset for new agent
    useEffect(() => {
        const id = params.id; // Get the agent ID from the route parameter
        if (id) {
            setIsNew(false); // Not a new agent, fetching existing data
            fetchData(id); // Fetch data for existing agent
        } else {
            setIsNew(true); // New agent, reset form
            setForm({
                first_name: "",
                last_name: "",
                region: "",
                rating: "",
                fee: "",
            });
        }
    }, [params.id, fetchData]);

    // Validate form fields
    const validateForm = () => {
        const errors = [];
        // Validation rules for rating
        if (form.rating > 100 || form.rating < 0) {
            errors.push("Rating must be between 0 and 100.");
        }
        // Validation rules for fee
        if (form.fee < 0) {
            errors.push("Fee must not be negative.");
        }
        // Validation for names
        if (!form.first_name || !form.last_name || !/^[a-zA-Z'-]+$/.test(form.first_name) || !/^[a-zA-Z'-]+$/.test(form.last_name)) {
            errors.push("First name and last name are required and must not contain numbers or special characters except for hyphens and apostrophes.");
        }
        // Validation for region
        if (!form.region) {
            errors.push("Region is required.");
        }
        return errors;
    };

    // Update form state
    const updateForm = (value) => {
        setForm((prev) => ({ ...prev, ...value }));
    };

    // Handle form submission
    const onSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (errors.length > 0) {
            setNotification({ message: errors.join("\n"), type: "error" });
            setTimeout(() => { setNotification({ message: "", type: "" }); }, 7000);
            return;
        }
        setIsModalOpen(true); // Open modal for confirmation before submitting
    };

    // Confirm agent creation or update
    const handleConfirm = async () => {
        const method = isNew ? 'POST' : 'PATCH'; // Determine HTTP method based on isNew state
        const url = `http://localhost:3004/agents/${isNew ? '' : params.id}`;
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form) // Send form data as JSON
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            await response.json(); // Parse JSON response
            setNotification({
                message: `Agent has been ${isNew ? 'created' : 'updated'} successfully!`,
                type: "success"
            });
            setTimeout(() => { setNotification({ message: "", type: "" }); }, 7000);

            if (isNew) {
                setForm({ // Reset form if new agent was created
                    first_name: "",
                    last_name: "",
                    region: "",
                    rating: "",
                    fee: "",
                });
            }
        } catch (error) {
            setNotification({ message: error.message, type: "error" });
            setTimeout(() => { setNotification({ message: "", type: "" }); }, 7000);
        }
        setIsModalOpen(false); // Close modal after handling confirm
    };

    // Handle cancel action in modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-6 px-6 bg-gray-50 min-h-screen">
            {/* Title Section */}
            <div className="text-left mb-8">
                <h2 className="text-3xl font-semibold mb-1 text-gray-800">
                    {isNew ? 'Create Agent' : 'Update Agent'}
                </h2>
                <p className="text-gray-500">Fill in the details below to {isNew ? 'create a new' : 'update this'} agent</p>
            </div>

            {/* Notification */}
            {notification.message && (
                <div
                    className={`mb-6 px-4 py-3 rounded-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    role="alert"
                >
                    {notification.type === "error" && notification.message.includes("\n") ? (
                        <ul className="list-disc pl-5">
                            {notification.message.split("\n").map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    ) : (
                        notification.message
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                message={`Are you sure you want to ${isNew ? 'create' : 'update'} this agent?`}
            />

            {/* Form */}
            <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400
                                       transition-all duration-200 hover:border-gray-300 shadow-sm"
                            placeholder="First name"
                            value={form.first_name}
                            onChange={(e) => updateForm({ first_name: e.target.value })}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400
                                       transition-all duration-200 hover:border-gray-300 shadow-sm"
                            placeholder="Last name"
                            value={form.last_name}
                            onChange={(e) => updateForm({ last_name: e.target.value })}
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <input
                            type="number"
                            max="100"
                            min="0"
                            name="rating"
                            id="rating"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400
                                       transition-all duration-200 hover:border-gray-300 shadow-sm"
                            placeholder="Rating out of 100"
                            value={form.rating}
                            onChange={(e) => updateForm({ rating: e.target.value })}
                        />
                    </div>

                    {/* Fee */}
                    <div>
                        <input
                            type="number"
                            step="100"
                            min="0"
                            name="fee"
                            id="fee"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400
                                       transition-all duration-200 hover:border-gray-300 shadow-sm"
                            placeholder="Fee (USD)"
                            value={form.fee}
                            onChange={(e) => updateForm({ fee: e.target.value })}
                        />
                    </div>

                    {/* Region */}
                    <div className="md:col-span-2">
                        <div className="mt-2 flex items-center space-x-6">
                            {['North', 'South', 'East', 'West'].map((region) => (
                                <div key={region} className="flex items-center">
                                    <input
                                        id={`region-${region}`}
                                        name="regionOptions"
                                        type="radio"
                                        value={region}
                                        className="h-4 w-4 text-blue-400 focus:ring-blue-400"
                                        checked={form.region === region}
                                        onChange={(e) => updateForm({ region: e.target.value })}
                                    />
                                    <label htmlFor={`region-${region}`} className="ml-2 block text-sm text-gray-700">
                                        {region}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex space-x-4 justify-center">
                    <button
                        type="submit"
                        className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    >
                        Save Agent
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/agents")}
                        className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100/50 hover:bg-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    >
                        Agent List
                    </button>
                </div>
            </form>
        </div>
    );

}