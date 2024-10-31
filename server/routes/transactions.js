// Import Express module to handle HTTP requests
import express from 'express';
// Import the Transaction model to interact with the transaction data in the database
import Transaction from '../models/TransactionModel.js';
// Import the Agent model to interact with the agent data in the database
import Agent from '../models/AgentModel.js';

// Initialize a new Express router to manage routes
const router = express.Router();

// Define a GET route to fetch the last 10 transactions sorted by date with agent details populated
router.get('/transaction-data', async (req, res) => {
    try {
        console.log("Fetching the last 10 transactions and all agents...");
        // Find the last 10 transactions, sort them by date in descending order, and populate agent details
        const transactions = await Transaction.find()
            .populate('agent_id', 'first_name last_name') // Populate only first_name and last_name of agent
            .sort({ date: -1 }) // Sort transactions by date in descending order
            .limit(10); // Limit to the last 10 transactions
        const agents = await Agent.find(); // Fetch all agents

        console.log(`Fetched ${transactions.length} transactions and ${agents.length} agents.`);
        // Log structured data to be sent in response
        console.log("API Response:", { status: "ok", data: { transactions, agents }, message: null });
        // Send response with transaction and agent data
        res.json({ status: "ok", data: { transactions, agents }, message: null });
    } catch (error) {
        // Log the error and send an error response
        console.error("Failed to fetch data:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch data" });
    }
});

// Define a POST route to submit a new transaction
router.post('/transaction', async (req, res) => {
    const { amount, agent_id, date } = req.body; // Destructure amount, agent_id, and date from request body
    console.log("Received transaction submission with:", { amount, agent_id, date });

    if (!amount || amount <= 0) {
        // Validate that amount is a positive number
        console.log("Validation error: Amount must be a positive number.");
        return res.status(400).json({ status: 'error', message: 'Amount must be a positive number' });
    }

    try {
        // Create a new Transaction object with received data
        const newTransaction = new Transaction({
            amount,
            agent_id,
            date: date ? new Date(date) : new Date() // Use provided date or current date
        });

        const result = await newTransaction.save(); // Save the new transaction to the database
        console.log("Transaction successfully inserted.", result);
        // Respond with success message and transaction data
        res.status(200).json({ status: 'ok', message: 'Transaction successful!', transaction: result });
    } catch (error) {
        // Log the error and respond with failure message
        console.error("Error processing transaction", error);
        res.status(500).json({ status: 'error', message: 'Transaction failed!' });
    }
});

// Define a PUT route to edit an existing transaction
router.put('/transaction/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, agent_id, date } = req.body; // Destructure amount, agent_id, and date from request body
    console.log("Received transaction update with:", { id, amount, agent_id, date });

    if (!amount || amount <= 0) {
        // Validate that amount is a positive number
        console.log("Validation error: Amount must be a positive number.");
        return res.status(400).json({ status: 'error', message: 'Amount must be a positive number' });
    }

    try {
        // Find the transaction by ID and update it with the new data
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            { amount, agent_id, date: date ? new Date(date) : new Date() },
            { new: true } // Return the updated document
        );

        if (!updatedTransaction) {
            console.log("Transaction not found.");
            return res.status(404).json({ status: 'error', message: 'Transaction not found' });
        }

        console.log("Transaction successfully updated.", updatedTransaction);
        // Respond with success message and updated transaction data
        res.status(200).json({ status: 'ok', message: 'Transaction updated successfully!', transaction: updatedTransaction });
    } catch (error) {
        // Log the error and respond with failure message
        console.error("Error updating transaction", error);
        res.status(500).json({ status: 'error', message: 'Transaction update failed!' });
    }
});

// Export the router for use in the main application file
export default router;