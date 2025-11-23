import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 4000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Swagger docs at http://localhost:${PORT}/api/docs`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

start();
