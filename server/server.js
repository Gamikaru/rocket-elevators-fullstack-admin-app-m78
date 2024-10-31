//this file is the entry point of the server application. It imports the necessary modules and configurations, initializes an Express application, and starts the server on a specified port. It also sets up middleware for CORS and JSON parsing, and defines routes for agent, user, and transaction requests. The server listens on the specified port and logs a message to the console once it is running.




// Import necessary modules and configurations
import dotenv from "dotenv/config"; // Automatically loads and parses the .env file and attaches it to process.env
import express from "express"; // Import the Express framework for creating the server
import cors from "cors"; // Import CORS middleware to enable Cross-Origin Resource Sharing
import agents from "./routes/agent.js"; // Import routes for 'agents' from the specified module
import users from "./routes/user.js"; // Import routes for 'users' from the specified module
import transactions from "./routes/transactions.js"; // Import routes for 'transactions' from the specified module
import reports from "./routes/reports.js"; // Import routes for 'reports' from the specified module

// Retrieve the server's port number from environment variables or use 3004 as a default
const PORT = process.env.PORT || 3004;
// Initialize an Express application
const app = express();

// Middleware to enable CORS with default settings, allowing requests from any origin
app.use(cors());
// Middleware to parse JSON bodies, making it easy to access request data
app.use(express.json());
// Routes handling for agent-related requests, all routes inside will be prefixed with '/agents'
app.use("/agents", agents);
// Routes handling for user-related requests, all routes inside will be prefixed with '/users'
app.use("/users", users);
// Routes handling for transaction-related requests, all routes inside will be prefixed with '/transactions'
app.use("/transactions", transactions);
// ROute to handle requests for transaction reports
app.use("/reports", reports);    



// Start the Express server on the specified port and log the running port to the console
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Confirmation message once the server is running
});

// Export the Express application to be used by other modules

export default app;
