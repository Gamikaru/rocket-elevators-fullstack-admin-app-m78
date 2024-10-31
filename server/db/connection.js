// Import the Mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Retrieve the MongoDB connection URI from environment variables for security and configuration flexibility
const uri = process.env.ATLAS_URI;

// Define an asynchronous function to establish a connection to MongoDB using Mongoose
async function connect() {
    try {
        // Connect to MongoDB using the provided URI and additional options to improve connection performance
        await mongoose.connect(uri, {
            useNewUrlParser: true, // Enable the new URL string parser which avoids deprecated URL string parser in MongoDB Node.js driver
            useUnifiedTopology: true // Enable the new Server Discover and Monitoring engine which avoids using a deprecated engine
        });
        // Log a success message to the console when connection is successful
        console.log("Successfully connected to MongoDB Atlas via Mongoose");
    } catch (err) {
        // Log an error message if the connection fails
        console.error("Connection to MongoDB Atlas failed", err);
        // Exit the process with a status code of 1 indicating that the process terminates due to an error
        process.exit(1);
    }
}

// Invoke the connect function to establish the database connection as soon as the module is loaded
connect();

// Export the mongoose instance. This allows other files to use the same connected instance, ensuring that the connection is managed centrally
export default mongoose;
