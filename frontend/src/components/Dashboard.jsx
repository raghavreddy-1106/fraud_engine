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

  return (
    <>
        <div className="dashboard">
            <div className="card total-card">
                <h3>Total Transactions</h3>
                <p>{transactions.length}</p>
            </div>

            <div className="card approved-card">
                <h3>Approved</h3>
                <p>
                    {transactions.filter((t) => t.status === "APPROVED").length}
                </p>
            </div>

            <div className="card flagged-card">
                <h3>Flagged</h3>
                <p>
                    {transactions.filter((t) => t.status === "FLAGGED").length}
                </p>
            </div>

            <div className="card blocked-card">
                <h3>Blocked</h3>
                <p>
                    {transactions.filter((t) => t.status === "BLOCKED").length}
                </p>
            </div>
        </div>

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
                    <span className={`risk ${transaction.risk_level.toLowerCase()}`}>
                        {transaction.risk_level}
                    </span>
                </td>

                <td>
                    <span className={`status ${transaction.status.toLowerCase()}`}>
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