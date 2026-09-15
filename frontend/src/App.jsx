import "./App.css";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";

function App() {
  return (
    <div className="app">
      <h1>Real-Time Risk & Fraud Engine</h1>
      <p>BNP Cross-Border Transaction Monitoring</p>

      <TransactionForm />

      <Dashboard />
    </div>
  );
}

export default App;