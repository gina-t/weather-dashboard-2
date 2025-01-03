// this file is the main entry point for the server app. It sets up the Express server, configures middleware, and connects the routes.
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Explicitly specify the path to the .env file
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// Import the routes
import routes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));
// Implement middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Implement middleware to connect the routes
app.use(routes);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
