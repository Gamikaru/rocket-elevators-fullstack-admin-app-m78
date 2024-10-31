// Import mongoose to interact with MongoDB
import mongoose from 'mongoose';

// Define the schema for sessions, specifying structure and validation rules
const sessionSchema = new mongoose.Schema({
    // 'session_token' field which is a string and is required
    session_token: { type: String, required: true },
    // 'user' field to link session to a specific user, references the 'User' model
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }); // Enable automatic timestamps for created and updated times

// Create an index on the 'createdAt' field with an expiry time of 24 hours (86400 seconds)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Compile the schema into a Model to interface with the 'sessions' collection in the database
const Session = mongoose.model('Session', sessionSchema);

// Export the Session model for use elsewhere in the application
export default Session;
