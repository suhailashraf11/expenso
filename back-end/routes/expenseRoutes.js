const express = require("express");

const {
    addExpense,
    getExpenses,
    deleteExpense,
    getTotalExpense
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addExpense);

router.get("/user", authMiddleware, getExpenses);

router.get("/total", authMiddleware, getTotalExpense);

router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;