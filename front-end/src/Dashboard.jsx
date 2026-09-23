import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  useEffect(() => {
    fetchExpenses();
    fetchTotalExpense();
  }, []);

  // Handle invalid or expired JWT
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  // Get all expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/expenses/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Expenses:", data);

      // Invalid or expired token
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        setExpenses(data);
      } else {
        console.error("Get expenses failed:", data);
      }
    } catch (error) {
      console.error("Get expenses error:", error);
    }
  };

  // Get total expense
  const fetchTotalExpense = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/expenses/total",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Total expense response:", data);

      // Invalid or expired token
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        setTotalExpense(Number(data.total) || 0);
      } else {
        console.error("Get total expense failed:", data);
        setTotalExpense(0);
      }
    } catch (error) {
      console.error("Get total expense error:", error);
      setTotalExpense(0);
    }
  };

  // Add expense
  const handleAddExpense = async () => {
    // Check expense name
    if (!expenseName.trim()) {
      alert("Please enter an expense name.");
      return;
    }

    // Check amount
    if (!expenseAmount) {
      alert("Please enter an amount.");
      return;
    }

    // Check if amount is a valid number
    if (isNaN(Number(expenseAmount))) {
      alert("Amount must be a valid number.");
      return;
    }

    // Check amount is greater than zero
    if (Number(expenseAmount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/expenses/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: expenseName.trim(),
            amount: Number(expenseAmount),
            description: expenseDescription.trim(),
          }),
        },
      );

      const data = await response.json();

      console.log("Add expense response:", data);

      // Invalid or expired token
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        setExpenseName("");
        setExpenseAmount("");
        setExpenseDescription("");
        setShowForm(false);

        fetchExpenses();
        fetchTotalExpense();
      } else {
        alert(data.message || "Failed to add expense.");
      }
    } catch (error) {
      console.error("Add expense error:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Delete expense
  const handleDeleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Delete expense response:", data);

      // Invalid or expired token
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        fetchExpenses();
        fetchTotalExpense();
      } else {
        alert(data.message || "Failed to delete expense.");
      }
    } catch (error) {
      console.error("Delete expense error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">

        <div className="dashboard-title">
          <h1>Expense Tracker</h1>

          <p>
            Manage and track your daily expenses
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Expense
        </button>

      </div>

      {/* Total Expense */}
      <div className="total-card">

        <p>Total Expense</p>

        <h2>
          ₹{Number(totalExpense).toFixed(2)}
        </h2>

      </div>

      {/* Add Expense Modal */}
      {showForm && (

        <div className="modal-overlay">

          <div className="modal-content">

            <div className="modal-header">

              <h2>Add Expense</h2>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>

            </div>

            {/* Expense Name */}
            <input
              type="text"
              placeholder="Expense name"
              value={expenseName}
              onChange={(event) =>
                setExpenseName(event.target.value)
              }
            />

            {/* Expense Amount */}
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(event) =>
                setExpenseAmount(event.target.value)
              }
            />

            {/* Expense Description */}
            <textarea
              placeholder="Description"
              value={expenseDescription}
              onChange={(event) =>
                setExpenseDescription(event.target.value)
              }
            />

            <button
              className="save-button"
              onClick={handleAddExpense}
            >
              Save Expense
            </button>

            <button
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* Expense List */}
      <div className="expense-list">

        {expenses.length === 0 ? (

          <div className="empty-state">

            <h3>No expenses yet</h3>

            <p>
              Click "+ Add Expense" to add your first expense.
            </p>

          </div>

        ) : (

          expenses.map((expense) => (

            <div
              className="expense-card"
              key={expense.id}
            >

              <div className="expense-card-header">

                <h3>
                  {expense.name}
                </h3>

                <span className="expense-amount">
                  ₹{Number(expense.amount).toFixed(2)}
                </span>

              </div>

              <p className="expense-description">
                {expense.description}
              </p>

              <button
                className="delete-button"
                onClick={() =>
                  handleDeleteExpense(expense.id)
                }
              >
                Delete
              </button>

            </div>

          ))

        )}

      </div>

      {/* Logout */}
      <button
        className="logout-button"
        onClick={onLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Dashboard;