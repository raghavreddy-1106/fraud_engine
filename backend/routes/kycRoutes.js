const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
    upload,
    uploadKyc,
    getKycStatus
} = require("../controllers/kycController");

const router = express.Router();

router.get(
    "/status/:userId",
    authenticate,
    getKycStatus
);

router.post(
    "/upload",
    authenticate,
    upload.single("document"),
    uploadKyc
);

module.exports = router;