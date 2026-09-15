const axios = require("axios");

const getRiskScore = async (req, res) => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/risk-score",
            {
                amount: 50000,
                hour: 2,
                country: "FR",
                kycStatus: "VERIFIED",
                transactionCount: 1
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Risk service unavailable",
            error: error.message
        });
    }
};

module.exports = { getRiskScore };