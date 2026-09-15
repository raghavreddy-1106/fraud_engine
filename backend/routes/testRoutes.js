const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

module.exports = router;