import { useState } from "react";

function TransactionForm() {
  const [form, setForm] = useState({
    userId: 1,
    amount: "",
    currency: "EUR",
    destinationCountry: "FR",
    transactionType: "PAYMENT",
    oldBalanceOrg: "",
    newBalanceOrig: "",
    oldBalanceDest: "",
    newBalanceDest: "",
    isFlaggedFraud: 0,
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
            userId: Number(form.userId),
            amount: Number(form.amount),
            currency: form.currency,
            destinationCountry: form.destinationCountry,
            transactionType: form.transactionType,
            oldBalanceOrg: Number(form.oldBalanceOrg),
            newBalanceOrig: Number(form.newBalanceOrig),
            oldBalanceDest: Number(form.oldBalanceDest),
            newBalanceDest: Number(form.newBalanceDest),
            isFlaggedFraud: Number(form.isFlaggedFraud),
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

      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (error) {
      console.error(error);
      setMessage("Transaction failed");
    }
  };

  return (
    <div className="form-card transaction-card">
      <h2>Create Transaction</h2>

      <p className="form-subtitle">
        Enter transaction details to evaluate fraud risk in real time.
      </p>

      <form className="transaction-form" onSubmit={handleSubmit}>

        <div className="field">
          <label>Transaction Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            min="1"
            required
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

        <div className="field">
          <label>Transaction Type</label>
          <select
            name="transactionType"
            value={form.transactionType}
            onChange={handleChange}
          >
            <option value="PAYMENT">PAYMENT</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="CASH_OUT">CASH OUT</option>
            <option value="CASH_IN">CASH IN</option>
            <option value="DEBIT">DEBIT</option>
          </select>
        </div>

        <div className="field">
          <label>Old Balance (Sender)</label>
          <input
            type="number"
            name="oldBalanceOrg"
            placeholder="0"
            value={form.oldBalanceOrg}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="field">
          <label>New Balance (Sender)</label>
          <input
            type="number"
            name="newBalanceOrig"
            placeholder="0"
            value={form.newBalanceOrig}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="field">
          <label>Old Balance (Receiver)</label>
          <input
            type="number"
            name="oldBalanceDest"
            placeholder="0"
            value={form.oldBalanceDest}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="field">
          <label>New Balance (Receiver)</label>
          <input
            type="number"
            name="newBalanceDest"
            placeholder="0"
            value={form.newBalanceDest}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button type="submit" className="transaction-button">
          Check Transaction
        </button>

      </form>

      {message && (
        <p className="transaction-message">
          {message}
        </p>
      )}
    </div>
  );
}

export default TransactionForm;