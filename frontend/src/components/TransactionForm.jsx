import { useState } from "react";

function TransactionForm() {
  const [form, setForm] = useState({
    userId: 1,
    amount: "",
    currency: "EUR",
    destinationCountry: "FR",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            amount: Number(form.amount),
            userId: Number(form.userId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Transaction failed");
        return;
      }

      setMessage(
        `${data.status} - Risk: ${data.risk_level} (${data.risk_score})`
      );

      setForm({
        userId: 1,
        amount: "",
        currency: "EUR",
        destinationCountry: "FR",
      });

      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (error) {
      setMessage("Transaction failed");
      console.error(error);
    }
  };

  return (
    <div className="form-card">
      <h2>Create Transaction</h2>
      <p className="form-subtitle">
        Enter transaction details to evaluate fraud risk in real time.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Transaction Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="field">
          <label>Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>

        <div className="field">
          <label>Destination Country</label>
          <select
            name="destinationCountry"
            value={form.destinationCountry}
            onChange={handleChange}
          >
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="US">USA</option>
            <option value="IN">India</option>
          </select>
        </div>

        <button type="submit">Check Transaction</button>
      </form>

      {message && <p className="transaction-message">{message}</p>}
    </div>
  );
}

export default TransactionForm;