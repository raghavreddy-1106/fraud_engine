const express = require("express");

const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);

module.exports = router;