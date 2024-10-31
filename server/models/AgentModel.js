// Import mongoose from a custom connection setup file rather than directly from the 'mongoose' package
import mongoose from '../db/connection.js';

// Define the schema for an agent with specific fields and validation rules
const agentSchema = new mongoose.Schema({
    // 'first_name' field must be a string and is required
    first_name: { type: String, required: true },
    // 'last_name' field must be a string and is required
    last_name: { type: String, required: true },
    // 'region' field must be a string and is required
    region: { type: String, required: true },
    // 'rating' field must be a number and is required
    rating: { type: Number, required: true },
    // 'fee' field must be a number and is required
    fee: { type: Number, required: true },
});

// Compile the defined schema into a model named 'Agent' to interact with the 'agents' collection in the database
const Agent = mongoose.model('Agent', agentSchema);

// Export the Agent model so it can be used in other parts of the application
export default Agent;
