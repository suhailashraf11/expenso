const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");




const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// User routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            message: "Expense Tracker API is running",
            database: "MySQL connected successfully"
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});