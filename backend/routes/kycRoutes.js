const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { upload, uploadKyc } = require("../controllers/kycController");

const router = express.Router();

router.post(
    "/upload",
    authenticate,
    upload.single("document"),
    uploadKyc
);

module.exports = router;