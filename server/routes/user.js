// Import necessary modules from dependencies
import express from "express";                       // Express framework for handling HTTP requests
import bcrypt from 'bcrypt';                         // Bcrypt library for password hashing
import jwt from "jsonwebtoken";                      // JSON Web Token for creating access tokens
import User from "../models/UserModel.js";           // User model from the database schema
import config from "../config.js";                   // Configuration file, e.g., containing secrets and settings
import Session from "../models/SessionModel.js";     // Session model to store active sessions
import { v4 as uuidv4 } from 'uuid';                 // UUID library to generate unique identifiers

// Setup Express router for routing the API calls
const router = express.Router();

// Retrieve the JWT secret from the configuration
const { JWT_SECRET } = config;

// Route to handle POST request for user login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;  // Destructure email and password from the request body
    if (!email || !password) {
        // If email or password is missing, return an error
        return res.status(400).send("Email and password are required");
    }

    try {
        // Look for a user with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            // If no user is found, return an error
            return res.status(404).send("User not found");
        }

        // Compare the provided password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // If the password is invalid, return an error
            return res.status(401).send("Invalid password");
        }

        // If the password is valid, generate a JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET);

        // Generate a unique session token
        const sessionToken = uuidv4();

        // Save the session token in the database
        await new Session({
            session_token: sessionToken,
            user: user._id
        }).save();

        // Return both the JWT and the session token to the client
        res.status(200).send({ token, sessionToken });
    } catch (error) {
        // Log any server error and return an error message
        console.error(error);
        res.status(500).send("Error logging in user");
    }
});

// Route to validate session tokens
router.get('/validate_token', async (req, res) => {
    const { token } = req.query;  // Retrieve the token from query parameters
    const session = await Session.findOne({ session_token: token }).populate('user');
    if (!session) {
        // If session is not found, return an error
        return res.status(404).json({ valid: false, message: 'Session not found' });
    }
    // If session is found, return success and the user details
    res.status(200).json({ valid: true, user: session.user });
});

// Route to handle user registration
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body; // Destructure registration details from request body
    if (!first_name || !last_name || !email || !password) {
        // Check for missing fields and return an error if any are missing
        return res.status(400).send("All fields are required");
    }

    // Validate password length and character requirements
    if (password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters");
    }
    if (!password.match(/^(?=.*[!@#$%^&*])/)) {
        return res.status(400).send("Password must contain at least one special character");
    }

    // Check for existing user with the same email
    const existingUser = await User.findOne({
        email
    });
    if (existingUser) {
        // If user already exists, return an error
        return res.status(409).send("User already exists");
    }

    try {
        // Create a new user and save to the database
        const newUser = new User({
            first_name,
            last_name,
            email,
            password
        });
        await newUser.save();
        // Return success message after user creation
        res.status(201).send("User created");
    } catch (error) {
        // Log any errors during user creation and return an error message
        console.error(error);
        res.status(500).send("Error creating user");
    }
}
);

// Export the router for use in the main server file
export default router;
