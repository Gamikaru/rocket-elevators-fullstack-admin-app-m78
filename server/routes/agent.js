// Import necessary modules
import express from "express";
// import findbyidanddelete from "mongoose";
import Agent from "../models/AgentModel.js"; // Import the Agent model


// Create a new Express router to handle HTTP requests
const router = express.Router();

// GET route to fetch all agents
router.get("/", async (req, res) => {
    try {
        // Find all agents in the database
        const agents = await Agent.find({});
        // Send the agents data to the client with a 200 OK status
        res.status(200).json(agents);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error status
        console.error(error);
        res.status(500).json({ error: "Failed to fetch agents" });
    }
});

// GET route to fetch a single agent by ID
router.get("/:id", async (req, res) => {
    try {
        // Find the agent by ID
        const agent = await Agent.findById(req.params.id);
        // If no agent is found, send a 404 Not Found status
        if (!agent) {
            return res.status(404).json({ error: "Agent not found" });
        }
        // Otherwise, send the agent data with a 200 OK status
        res.status(200).json(agent);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error status
        console.error(error);
        res.status(500).json({ error: "Failed to fetch agent" });
    }
});

// POST route to create a new agent
router.post("/", async (req, res) => {
    try {
        // Create a new agent document from the request body
        const newAgent = new Agent({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            region: req.body.region,
            rating: req.body.rating,
            fee: req.body.fee,
        });
        // Save the new agent to the database
        const savedAgent = await newAgent.save();
        // Send the saved agent data with a 201 Created status
        res.status(201).json(savedAgent);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error status
        console.error(error);
        res.status(500).json({ error: "Failed to create agent" });
    }
});

// PATCH route to update an existing agent by ID
router.patch("/:id", async (req, res) => {
    try {
        // Find the agent by ID and update it with the request body
        const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // If no agent is found, send a 404 Not Found status
        if (!updatedAgent) {
            return res.status(404).json({ error: "Agent not found" });
        }
        // Send the updated agent data with a 200 OK status
        res.status(200).json(updatedAgent);
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error status
        console.error(error);
        res.status(500).json({ error: "Failed to update agent" });
    }
});

// DELETE route to remove an agent by ID
router.delete("/:id", async (req, res) => {
    try {
        // Find the agent by ID and remove it from the database
        const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
        // If no agent is found, send a 404 Not Found status
        if (!deletedAgent) {
            return res.status(404).json({ error: "Agent not found" });
        }
        // Send a 204 No Content status on successful deletion
        res.status(204).send();
    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error status
        console.error(error);
        res.status(500).json({ error: "Failed to delete agent" });
    }
});

// Export the router for use in the main application file
export default router;