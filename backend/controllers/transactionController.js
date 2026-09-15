const axios = require("axios");
const pool = require("../config/db");

const createTransaction = async (req, res) => {
    try {
        const {
            userId,
            amount,
            currency,
            destinationCountry,
            transactionType,
            oldBalanceOrg,
            newBalanceOrig,
            oldBalanceDest,
            newBalanceDest,
            isFlaggedFraud
        } = req.body;

        // Get transaction history
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM transactions WHERE user_id = $1",
            [userId]
        );
        const userResult = await pool.query(
            "SELECT kyc_status FROM users WHERE id = $1",
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

    const kycStatus = userResult.rows[0].kyc_status;

        const transactionCount = Number(
            countResult.rows[0].count
        );

        // Rule-based risk
        const riskResponse = await axios.post(
            "http://127.0.0.1:8000/risk-score",
            {
                amount,
                hour: new Date().getHours(),
                country: destinationCountry,
                kycStatus,
                transactionCount
            }
        );

        const ruleRisk = riskResponse.data;

        // ML-based risk
        const mlResponse = await axios.post(
            "http://127.0.0.1:8000/ml-risk-paysim",
            {
                step: 1,
                type: transactionType,
                amount,
                oldbalanceOrg: oldBalanceOrg,
                newbalanceOrig: newBalanceOrig,
                oldbalanceDest: oldBalanceDest,
                newbalanceDest: newBalanceDest,
                isFlaggedFraud: isFlaggedFraud
            }
        );

        const mlRisk = mlResponse.data;
        const mlFraudProbability = mlRisk.fraudProbability;

        // Combine rule + ML decisions
        let finalRiskLevel = ruleRisk.riskLevel;
        let finalScore = ruleRisk.riskScore;
        let finalReason = ruleRisk.reason;

        if (mlRisk.riskLevel === "HIGH") {
            finalRiskLevel = "HIGH";
            finalScore = Math.max(finalScore, 70);
            finalReason += " + " + mlRisk.reason;
        } else if (
            mlRisk.riskLevel === "MEDIUM" &&
            finalRiskLevel === "LOW"
        ) {
            finalRiskLevel = "MEDIUM";
            finalScore = Math.max(finalScore, 40);
            finalReason += " + " + mlRisk.reason;
        }

        let status;

        if (finalRiskLevel === "HIGH") {
            status = "BLOCKED";
        } else if (finalRiskLevel === "MEDIUM") {
            status = "FLAGGED";
        } else {
            status = "APPROVED";
        }

        // Save transaction
        const result = await pool.query(
            `INSERT INTO transactions
            (
                user_id,
                amount,
                currency,
                destination_country,
                transaction_type,
                old_balance_org,
                new_balance_orig,
                old_balance_dest,
                new_balance_dest,
                ml_fraud_probability,
                risk_score,
                risk_level,
                status,
                reason
            )
            VALUES
            (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14
            )
            RETURNING *`,
            [
                userId,
                amount,
                currency,
                destinationCountry,
                transactionType,
                oldBalanceOrg,
                newBalanceOrig,
                oldBalanceDest,
                newBalanceDest,
                mlFraudProbability,
                finalScore,
                finalRiskLevel,
                status,
                finalReason
            ]
        );

        res.status(201).json({
            ...result.rows[0],
            mlRisk: mlRisk
        });

    } catch (error) {
        console.error("Create transaction error:", error);

        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message
        });
    }
};


const getTransactions = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.*, u.kyc_status
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC`
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

        const {
            status,
            riskScore,
            riskLevel,
            reason
        } = req.body;

        const result = await pool.query(
            `UPDATE transactions
             SET status = $1,
                 risk_score = $2,
                 risk_level = $3,
                 reason = $4
             WHERE id = $5
             RETURNING *`,
            [
                status,
                riskScore,
                riskLevel,
                reason,
                id
            ]
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