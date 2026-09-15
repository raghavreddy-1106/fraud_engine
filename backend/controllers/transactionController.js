const pool = require("../config/db");

const createTransaction = async (req, res) => {
    try {
        const { userId, amount, currency, destinationCountry } = req.body;

        const result = await pool.query(
            `INSERT INTO transactions
            (user_id, amount, currency, destination_country)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [userId, amount, currency, destinationCountry]
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

module.exports = { createTransaction, getTransactions };