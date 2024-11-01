// Import the Express framework to create HTTP server and routing
import express from 'express';
// Import the Transaction model for interacting with the transaction data in the database
import Transaction from '../models/TransactionModel.js';

// Create a new Express router to define routes for incoming HTTP requests
const router = express.Router();

// Define a GET route for fetching transaction report data
router.get('/report-data', async (req, res) => {
    try {
        // Retrieve startDate and endDate from query parameters
        const { startDate, endDate } = req.query;

        // Build match conditions for date filtering
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        // Match condition for transactions
        const matchCondition = {};
        if (startDate || endDate) matchCondition.date = dateFilter;

        // Aggregate transaction data by agent to calculate the total transaction amount per agent
        const agentBarData = await Transaction.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$agent_id",
                    totalAmount: { $sum: "$amount" },
                }
            },
            {
                $lookup: {
                    from: "agents",
                    localField: "_id",
                    foreignField: "_id",
                    as: "agentDetails"
                }
            },
            { $unwind: "$agentDetails" },
            {
                $project: {
                    agentName: "$agentDetails.first_name",
                    totalAmount: 1,
                }
            }
        ]);

        // For the line chart, if no date range is specified, default to the last 14 days
        let lineMatchCondition = {};
        if (startDate || endDate) {
            lineMatchCondition.date = dateFilter;
        } else {
            const today = new Date();
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(today.getDate() - 14);
            lineMatchCondition.date = { $gte: twoWeeksAgo };
        }

        // Calculate daily transaction totals for the line chart
        const transactionLineData = await Transaction.aggregate([
            { $match: lineMatchCondition },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    dailyTotal: { $sum: "$amount" }
                }
            },
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