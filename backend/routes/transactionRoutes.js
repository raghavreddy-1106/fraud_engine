const express = require("express");

const {
    createTransaction,
    getTransactions,
    getTransactionById
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);

module.exports = router;