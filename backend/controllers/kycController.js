const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/kyc");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "application/pdf"
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and PDF files are allowed"));
        }
    }
});

const uploadKyc = async (req, res) => {
    try {
        const { userId, documentType } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "KYC document is required"
            });
        }

        let extractedText = "";
        let kycStatus = "PENDING";

        // OCR for JPG / PNG
        if (
            req.file.mimetype === "image/jpeg" ||
            req.file.mimetype === "image/png"
        ) {
            const result = await Tesseract.recognize(
                req.file.path,
                "eng"
            );

            extractedText = result.data.text;
        }

        // Text extraction for PDF
        if (req.file.mimetype === "application/pdf") {
            const pdfBuffer = fs.readFileSync(req.file.path);

            const pdfData = await pdfParse(pdfBuffer);

            extractedText = pdfData.text || "";
        }

        // Normalize extracted text
        const text = extractedText
            .toUpperCase()
            .replace(/\n/g, " ")
            .trim();

        // PAN validation
        if (documentType === "PAN") {
            const panPattern = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;

            if (panPattern.test(text)) {
                kycStatus = "VERIFIED";
            }
        }

        // Aadhaar validation
        if (documentType === "AADHAAR") {
            const aadhaarPattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;

            if (aadhaarPattern.test(text)) {
                kycStatus = "VERIFIED";
            }
        }

        const result = await pool.query(
            `UPDATE users
             SET kyc_status = $1::varchar(20),
                 kyc_document_type = $2::varchar(20),
                 kyc_document_path = $3::text,
                 kyc_verified_at = CASE
                     WHEN $1::varchar(20) = 'VERIFIED'
                     THEN CURRENT_TIMESTAMP
                     ELSE NULL
                 END
             WHERE id = $4
             RETURNING id,
                       name,
                       email,
                       kyc_status,
                       kyc_document_type,
                       kyc_document_path,
                       kyc_verified_at`,
            [
                kycStatus,
                documentType,
                req.file.path,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(201).json({
            message: "KYC document processed successfully",
            extractedText,
            kyc: result.rows[0]
        });

    } catch (error) {
        console.error("KYC upload error:", error);

        res.status(500).json({
            message: "KYC processing failed",
            error: error.message
        });
    }
};

const getKycStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT
                id,
                kyc_status,
                kyc_document_type,
                kyc_verified_at
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("KYC status error:", error);

        res.status(500).json({
            message: "Failed to fetch KYC status",
            error: error.message
        });
    }
};

module.exports = {
    upload,
    uploadKyc,
    getKycStatus
};