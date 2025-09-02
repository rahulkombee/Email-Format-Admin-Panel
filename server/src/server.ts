import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/email";
import { errorHandler } from "./middleware/errorHandlers";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// API Routes
app.use("/api", emailRoutes);

// Custom Error Handler Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});