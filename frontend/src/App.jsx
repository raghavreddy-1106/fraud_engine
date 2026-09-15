import { useState } from "react";
import Login from "./components/Login";
import TransactionForm from "./components/TransactionForm";
import Dashboard from "./components/Dashboard";
import KYCVerification from "./components/KYCVerification";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <div className="app">
      <h1>Real-Time Risk & Fraud Engine</h1>
      <p>BNP Cross-Border Transaction Monitoring</p>

      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>

          <KYCVerification />

          <TransactionForm />

          <Dashboard />
        </>
      )}
    </div>
  );
}

export default App;