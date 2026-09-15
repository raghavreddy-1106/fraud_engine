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
      const response = await fetch(
        "http://localhost:3000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            amount: Number(form.amount),
            userId: Number(form.userId),
          }),
        }
      );

      const data = await response.json();

      setMessage(
        `${data.status} - Risk: ${data.risk_level} (${data.risk_score})`
      );

      window.location.reload();

      setForm({
        userId: 1,
        amount: "",
        currency: "EUR",
        destinationCountry: "FR",
      });
    } catch (error) {
      setMessage("Transaction failed");
      console.error(error);
    }
  };

  return (
    <div className="form-card">
      <h2>Create Transaction</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
        </select>

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

        <button type="submit">Check Transaction</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default TransactionForm;