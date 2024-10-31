// Import mongoose object configured from the connection setup file
import mongoose from '../db/connection.js';

// Define the schema for a transaction with specific fields and validation rules
const transactionSchema = new mongoose.Schema({
    // 'date' field with a default value set to the current date and time
    date: { type: Date, default: Date.now },
    // 'amount' field that must be a number and is required
    amount: { type: Number, required: true },
    // 'agent_id' field that stores a reference to an Agent model, required for linking transactions to agents
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
});

// Create the Transaction model from the defined schema to interface with the database under the 'transactions' collection
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the Transaction model for use in other parts of the application, allowing transaction data management
export default Transaction;
