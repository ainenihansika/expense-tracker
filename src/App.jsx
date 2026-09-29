
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
  });

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
  });

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || Number(form.amount) <= 0) {
      alert("Enter a name and a valid amount.");
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        ...form,
        amount: Number(form.amount),
      },
    ]);

    setForm({
      title: "",
      amount: "",
      category: "Food",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === filter);

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">Track your spending, one day at a time.</p>
        </div>
        <div className="total-card">
          <p>Total Expenses</p>
          <h2>₹{total.toLocaleString("en-IN")}</h2>
          <span>{expenses.length} transactions</span>
        </div>
      </header>

      <section className="panel">
        <h2>Add an expense</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <label>
            Expense name
            <input
              type="text"
              placeholder="e.g. Lunch"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </label>

          <label>
            Amount (₹)
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              required
            />
          </label>

          <label>
            Category
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Health</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </label>

          <button type="submit" className="add-button">
            + Add Expense
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="list-header">
          <h2>Recent transactions</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option>All</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Other</option>
          </select>
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="empty">No expenses yet. Add one above!</p>
        ) : (
          <div className="transactions">
            {filteredExpenses.map((expense) => (
              <div className="transaction" key={expense.id}>
                <div className="transaction-icon">
                  {expense.category === "Food" ? "🍜" :
                   expense.category === "Travel" ? "🚗" :
                   expense.category === "Shopping" ? "🛍️" :
                   expense.category === "Bills" ? "🧾" :
                   expense.category === "Health" ? "💊" : "💰"}
                </div>
                <div className="transaction-info">
                  <strong>{expense.title}</strong>
                  <span>{expense.category} · {expense.date}</span>
                </div>
                <strong className="amount">
                  ₹{expense.amount.toLocaleString("en-IN")}
                </strong>
                <button
                  className="delete-button"
                  onClick={() => deleteExpense(expense.id)}
                  aria-label={`Delete ${expense.title}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      <footer>Made with care · Your spending, in control.</footer>
    </main>
  );
}

export default App;