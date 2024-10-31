// Import the Express framework to create HTTP server and routing
import express from 'express'; 
// Import the Transaction model for interacting with the transaction data in the database
import Transaction from '../models/TransactionModel.js'; 

// Create a new Express router to define routes for incoming HTTP requests
const router = express.Router();

// Define a GET route for fetching transaction report data
router.get('/report-data', async (req, res) => {
    try {
        // Aggregate transaction data by agent to calculate the total transaction amount per agent
        // This data is intended for use in a bar graph representation
        const agentBarData = await Transaction.aggregate([
            // Group by agent ID and sum the amounts for each agent
            { $group: { _id: "$agent_id", totalAmount: { $sum: "$amount" } } },
            // Lookup to join with the agents collection to fetch agent details
            {
                $lookup: {
                    from: "agents", // Assumes your agents collection is named "agents"
                    localField: "_id",
                    foreignField: "_id",
                    as: "agentDetails"
                }
            },
            // Unwind the agentDetails to make it easier to project the next fields
            { $unwind: "$agentDetails" },
            // Project the necessary fields for the bar graph: agent's name and total transaction amount
            { $project: { agentName: "$agentDetails.first_name", totalAmount: 1 } }
        ]);

        // Calculate daily transaction totals for the last 14 days, intended for a line graph
        const today = new Date();
        const twoWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);

        const transactionLineData = await Transaction.aggregate([
            // Filter transactions from the last 14 days
            { $match: { date: { $gte: twoWeeksAgo } } },
            // Group by date and sum the amounts for each date
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, dailyTotal: { $sum: "$amount" } } },
            // Sort the results by date in ascending order
            { $sort: { "_id": 1 } }
        ]);

        // Send the aggregated data as a JSON response to the client
        res.json({ status: 'ok', data: { agentBarData, transactionLineData }, message: null });
    } catch (error) {
        // Log and handle any errors that occur during the fetch operation
        console.error("Error fetching report data:", error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch report data' });
    }
});

// Export the router for inclusion in the main server setup, allowing these routes to be served
export default router;
