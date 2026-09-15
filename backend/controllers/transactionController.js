
const axios = require("axios");
const pool = require("../config/db");

const createTransaction = async (req, res) => {
    try {
        const {
            userId,
            amount,
            currency,
            destinationCountry
        } = req.body;

        // Get actual transaction history for the user
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM transactions WHERE user_id = $1",
            [userId]
        );

        const transactionCount = Number(countResult.rows[0].count);

        const riskResponse = await axios.post(
            "http://127.0.0.1:8000/risk-score",
            {
                amount,
                hour: new Date().getHours(),
                country: destinationCountry,
                kycStatus: "VERIFIED",
                transactionCount
            }
        );

        const {
            riskScore,
            riskLevel,
            reason
        } = riskResponse.data;

        let status;

        if (riskLevel === "HIGH") {
            status = "BLOCKED";
        } else if (riskLevel === "MEDIUM") {
            status = "FLAGGED";
        } else {
            status = "APPROVED";
        }

        const result = await pool.query(
            `INSERT INTO transactions
            (user_id, amount, currency, destination_country,
             risk_score, risk_level, status, reason)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                userId,
                amount,
                currency,
                destinationCountry,
                riskScore,
                riskLevel,
                status,
                reason
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM transactions ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM transactions WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transaction",
            error: error.message
        });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, riskScore, riskLevel, reason } = req.body;

        const result = await pool.query(
            `UPDATE transactions
             SET status = $1,
                 risk_score = $2,
                 risk_level = $3,
                 reason = $4
             WHERE id = $5
             RETURNING *`,
            [status, riskScore, riskLevel, reason, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction deleted successfully",
            transaction: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};