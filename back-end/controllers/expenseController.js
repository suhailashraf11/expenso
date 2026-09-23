const db = require("../config/db");

// ADD EXPENSE
const addExpense = async (req, res) => {
    try {
        const { name, amount, description } = req.body;

        const userId = req.user.id;

        // Check required fields
        if (!name || amount === undefined || amount === null || amount === "") {
            return res.status(400).json({
                message: "Expense name and amount are required"
            });
        }

        // Check if amount is a valid number
        if (isNaN(Number(amount))) {
            return res.status(400).json({
                message: "Amount must be a valid number"
            });
        }

        // Amount must be greater than 0
        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        await db.query(
            "INSERT INTO expenses (user_id, name, amount, description) VALUES (?, ?, ?, ?)",
            [
                userId,
                name.trim(),
                Number(amount),
                description?.trim() || ""
            ]
        );

        res.status(201).json({
            message: "Expense added successfully"
        });

    } catch (error) {
        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL EXPENSES
const getExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        const [expenses] = await db.query(
            "SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        res.json(expenses);

    } catch (error) {
        console.error("Get expenses error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE EXPENSE
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = req.user.id;

        // Check expense ID
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const [result] = await db.query(
            "DELETE FROM expenses WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error("Delete expense error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET TOTAL EXPENSE
const getTotalExpense = async (req, res) => {
    try {
        const userId = req.user.id;

        const [result] = await db.query(
            "SELECT SUM(amount) AS total FROM expenses WHERE user_id = ?",
            [userId]
        );

        res.json({
            total: result[0].total || 0
        });

    } catch (error) {
        console.error("Get total expense error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    getTotalExpense
};