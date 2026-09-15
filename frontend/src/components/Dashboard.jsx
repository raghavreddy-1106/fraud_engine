import { useEffect, useState } from "react";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error(error));
  }, []);

  const approved = transactions.filter(
    (t) => t.status === "APPROVED"
  ).length;

  const flagged = transactions.filter(
    (t) => t.status === "FLAGGED"
  ).length;

  const blocked = transactions.filter(
    (t) => t.status === "BLOCKED"
  ).length;

  const lowRisk = transactions.filter(
    (t) => t.risk_level === "LOW"
  ).length;

  const mediumRisk = transactions.filter(
    (t) => t.risk_level === "MEDIUM"
  ).length;

  const highRisk = transactions.filter(
    (t) => t.risk_level === "HIGH"
  ).length;

  return (
    <>
      {/* Summary Cards */}
      <div className="dashboard">
        <div className="card total-card">
          <h3>Total Transactions</h3>
          <p>{transactions.length}</p>
        </div>

        <div className="card approved-card">
          <h3>Approved</h3>
          <p>{approved}</p>
        </div>

        <div className="card flagged-card">
          <h3>Flagged</h3>
          <p>{flagged}</p>
        </div>

        <div className="card blocked-card">
          <h3>Blocked</h3>
          <p>{blocked}</p>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="table-card risk-overview">
        <h2>Risk Overview</h2>

        <div className="risk-overview-grid">
          <div className="risk-box low-risk-box">
            <h3>LOW RISK</h3>
            <p>{lowRisk}</p>
            <span>Normal transactions</span>
          </div>

          <div className="risk-box medium-risk-box">
            <h3>MEDIUM RISK</h3>
            <p>{mediumRisk}</p>
            <span>Transactions requiring review</span>
          </div>

          <div className="risk-box high-risk-box">
            <h3>HIGH RISK</h3>
            <p>{highRisk}</p>
            <span>Transactions blocked</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-card">
        <h2>Recent Transactions</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Country</th>
              <th>Risk Score</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>

                <td>
                  {transaction.amount} {transaction.currency}
                </td>

                <td>{transaction.destination_country}</td>

                <td>{transaction.risk_score}</td>

                <td>
                  <span
                    className={`risk ${transaction.risk_level.toLowerCase()}`}
                  >
                    {transaction.risk_level}
                  </span>
                </td>

                <td>
                  <span
                    className={`status ${transaction.status.toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                </td>

                <td className="reason">
                  {transaction.reason || "Normal transaction"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;