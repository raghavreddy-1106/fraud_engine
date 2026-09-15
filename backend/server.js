const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const pool = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const riskRoutes = require("./routes/riskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", testRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/risk", riskRoutes);



app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "risk-fraud-backend"
    });
});

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected:", result.rows[0]);
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});