// Import mongoose to handle database operations for MongoDB
import mongoose from 'mongoose';
// Import bcrypt for password hashing
import bcrypt from 'bcrypt';

// Define the user schema with structure and validation rules for user documents
const userSchema = new mongoose.Schema({
    // Define a 'first_name' field that must be a string and is required
    first_name: { type: String, required: true },
    // Define a 'last_name' field that must be a string and is required
    last_name: { type: String, required: true },
    // Define an 'email' field that must be unique, match a specific regex pattern, and is required
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    // Define a 'password' field with minimum length and regex requirement for special characters; field is required
    password: {
        type: String,
        required: true,
        minlength: 8,
        match: /^(?=.*[!@#$%^&*])/
    }
});

// Add a pre-save hook to the schema to hash passwords before saving them to the database
userSchema.pre('save', async function (next) {
    // Check if the password field is modified (or is new), to avoid re-hashing unchanged passwords
    if (!this.isModified('password')) return next();

    // Generate a salt and use it to hash the password with a cost of 10 rounds
    this.password = await bcrypt.hash(this.password, 10);
    // Continue with saving the document
    next();
});

// Compile and export the schema into a model named 'User' for the users collection in MongoDB
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
export default User;
