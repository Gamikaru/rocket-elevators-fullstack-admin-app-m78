import dotenv from 'dotenv';
dotenv.config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET, // Removed the default to prevent accidental use of insecure defaults.
    apiKey: process.env.API_KEY, // API Key should also come from environment variables.
    apiUrl: process.env.API_URL || "http://api.example.com", // Default API URL can remain if it's generic and not sensitive.
};

if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment");
}
if (!config.apiKey) {
    throw new Error("API Key is not defined in the environment");
}

export default config;