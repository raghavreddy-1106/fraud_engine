# Real-Time Risk & Fraud Engine

A full-stack financial transaction monitoring and fraud detection system that combines rule-based risk analysis, machine learning, KYC verification, JWT authentication, PostgreSQL, and a React dashboard.

## Overview

The Real-Time Risk & Fraud Engine evaluates financial transactions in real time and determines whether they should be:

- ✅ APPROVED
- ⚠️ FLAGGED
- 🛑 BLOCKED

The system combines:

- Rule-based risk analysis
- PaySim Random Forest fraud detection
- KYC document verification
- JWT authentication
- PostgreSQL transaction history
- React monitoring dashboard

---

## Architecture

```text
                        React Frontend
                              |
                              v
                     Node.js + Express
                              |
                    +---------+---------+
                    |                   |
                    v                   v
               PostgreSQL        FastAPI ML Service
                                      |
                             +--------+--------+
                             |                 |
                             v                 v
                    Rule-Based Engine    PaySim Random Forest
                             |                 |
                             +--------+--------+
                                      |
                                      v
                              Hybrid Risk Decision
                                      |
                                      v
                                 PostgreSQL
                                      |
                                      v
                              React Dashboard

Technology Stack
Frontend
React
JavaScript
CSS
Vite
Backend
Node.js
Express.js
JWT
Axios
Multer
Tesseract.js
PDF parsing
Database
PostgreSQL
Machine Learning
Python
FastAPI
Pandas
Scikit-learn
Random Forest
Joblib
PaySim dataset
Development Tools
Git
GitHub
VS Code
Postman
FastAPI Swagger

Project Structure
fraud_engine/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── riskController.js
│   │   └── kycController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── testRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── riskRoutes.js
│   │   └── kycRoutes.js
│   │
│   ├── uploads/
│   │   └── kyc/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── KYCVerification.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   └── package.json
│
├── ml-service/
│   ├── app.py
│   ├── train_model.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
Risk Engine

The rule-based risk engine evaluates:

Transaction amount
Transaction time
Transaction history
KYC status
Current Rules
Transaction Amount
Amount >= 100000
→ +50 risk points
Amount > 30000
→ +30 risk points
Transaction Time

Transactions during unusual hours:

Hour < 6
OR
Hour > 22

→ +20 risk points
Transaction History
Transaction Count < 3

→ +20 risk points
KYC Status
KYC != VERIFIED

→ +30 risk points

The final rule-based score is limited to a maximum of 100.

Risk Levels
0 - 39
LOW
40 - 69
MEDIUM
70 - 100
HIGH
Transaction Decisions
LOW
↓
APPROVED
MEDIUM
↓
FLAGGED
HIGH
↓
BLOCKED
Machine Learning Fraud Detection

The project uses the PaySim dataset to train a Random Forest fraud detection model.

Important features include:

step
type
amount
oldbalanceOrg
newbalanceOrig
oldbalanceDest
newbalanceDest
isFlaggedFraud

Target:

isFraud

Where:

0 = Normal
1 = Fraud
ML Pipeline
PaySim Dataset
      |
      v
Fraud / Normal Separation
      |
      v
Normal Transaction Sampling
      |
      v
Feature Processing
      |
      v
Random Forest Training
      |
      v
Model Evaluation
      |
      v
Saved Model
ML Risk Levels

The ML service uses fraud probability thresholds:

Fraud Probability >= 70%
→ HIGH
Fraud Probability >= 30%
→ MEDIUM
Fraud Probability < 30%
→ LOW

The ML service returns:

Fraud prediction
Fraud probability
Risk level
Reason
Hybrid Risk Engine

The backend combines the rule-based risk result with the ML result.

Example:

Rule Risk = LOW
ML Risk   = HIGH

Final Risk = HIGH
Status     = BLOCKED
Decision Logic

When the ML model detects:

HIGH

the transaction is escalated to:

HIGH

and becomes:

BLOCKED

When the ML model detects:

MEDIUM

while the rule engine returns:

LOW

the final risk becomes:

MEDIUM

and the transaction becomes:

FLAGGED

Otherwise, the rule-based risk level is retained.

KYC Verification

The project includes a KYC document verification prototype.

Supported Document Types
PAN
Aadhaar
Passport
Supported File Formats
JPG
JPEG
PNG
PDF
KYC Flow
Upload Document
      |
      v
File Validation
      |
      v
OCR / PDF Text Extraction
      |
      v
Pattern Validation
      |
      v
KYC Status

The prototype extracts text from uploaded documents and checks for expected identity-document patterns.

PAN Pattern Example
AAAAA9999A

Example:

ABCDE1234F
KYC Limitation

This is a document-processing prototype.

It does not perform:

Government database verification
Official identity verification
Document authenticity verification
Face verification
Liveness detection
Digital identity confirmation

Therefore, the KYC feature should be considered a prototype verification workflow.

Transaction-Level KYC History

Each transaction stores the KYC status that existed when that transaction was created.

Example:

User KYC = VERIFIED
        |
        v
Transaction Created
        |
        v
Transaction KYC = VERIFIED

If the user's current KYC status later changes:

User KYC = PENDING

the historical transaction still contains:

Transaction KYC = VERIFIED

This preserves the original KYC context of each transaction.

Authentication

The backend uses JWT authentication to protect sensitive APIs.

Protected APIs reject requests without valid authentication.

Missing Token

Request:

GET /api/transactions

Expected response:

{
  "message": "Token required"
}
Invalid Token

Example:

Authorization: Bearer invalid-token

Expected:

Invalid token
Valid Token

A valid JWT allows authenticated access to protected transaction and KYC endpoints.

Database

PostgreSQL is used for persistent storage.

Users Table

Important fields:

id
name
email
password_hash
role
kyc_status
risk_profile
kyc_document_type
kyc_document_path
kyc_verified_at
Transactions Table

Important fields:

id
user_id
amount
currency
destination_country
transaction_type
old_balance_org
new_balance_orig
old_balance_dest
new_balance_dest
ml_fraud_probability
transaction_kyc_status
risk_score
risk_level
status
reason
created_at
API Endpoints
Authentication
POST /api/auth/login
Transactions
POST /api/transactions
GET /api/transactions
KYC
POST /api/kyc/upload
GET /api/kyc/status/:userId
ML Service
POST /risk-score
POST /ml-risk-paysim
GET /health
Example Transaction

A PaySim-style fraud-like transaction:

Type: TRANSFER

Amount: 181

Old Sender Balance: 181
New Sender Balance: 0

Old Receiver Balance: 0
New Receiver Balance: 0

Example result:

Risk Level: HIGH
Status: BLOCKED
Installation
Prerequisites

Install:

Node.js
npm
PostgreSQL
Python 3
Git
Clone Repository
git clone https://github.com/raghavreddy-1106/fraud_engine.git
cd fraud_engine
Backend Setup
cd backend
npm install

Create:

backend/.env

Example:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fraud_engine
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
JWT_SECRET=YOUR_SECRET_KEY

Do not commit .env to Git.

Frontend Setup

From the project root:

cd frontend
npm install
ML Service Setup

From the project root:

cd ml-service
python -m venv venv
macOS / Linux
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt
PostgreSQL Setup

Create the database:

CREATE DATABASE fraud_engine;

Create the required tables and columns used by the backend.

Running the Application

The application uses three services.

Terminal 1 — Backend
cd backend
node server.js

Backend:

http://localhost:3000
Terminal 2 — ML Service
cd ml-service
uvicorn app:app --reload --port 8000

ML service:

http://localhost:8000

Swagger documentation:

http://localhost:8000/docs
Terminal 3 — Frontend
cd frontend
npm run dev

Frontend:

http://localhost:5173
Testing

The project has been tested using:

React frontend
Postman
FastAPI Swagger
PostgreSQL
Browser API requests
Authentication Tests
Test 1 — No Token
GET /api/transactions

Expected:

{
  "message": "Token required"
}
Test 2 — Invalid Token
Authorization: Bearer invalid-token

Expected:

Invalid token
Test 3 — Valid Token

A valid JWT allows access to protected transaction and KYC endpoints.

Example Transaction Scenarios
Scenario 1 — Normal Transaction
Amount: 1000
Currency: EUR
Country: FR
Type: PAYMENT

Possible result:

Risk: LOW
Status: APPROVED

The exact result can also depend on transaction time and transaction history.

Scenario 2 — High-Value Transaction
Amount: 50000
Currency: EUR
Country: FR
Type: PAYMENT

This increases the rule-based risk score because of the high transaction amount.

Scenario 3 — Fraud-Like Transaction
Amount: 181
Type: TRANSFER

Sender:
181 → 0

Receiver:
0 → 0

Expected example:

Risk: HIGH
Status: BLOCKED
Model Training

To train the PaySim model:

cd ml-service
python train_model.py

The training process:

Loads the PaySim dataset.
Separates fraudulent transactions.
Samples normal transactions.
Processes categorical features.
Splits the data into training and testing sets.
Trains a Random Forest model.
Evaluates the model.
Saves the trained model and preprocessing pipeline.

Large datasets and generated model files are intentionally excluded from Git.

Security

The project includes:

JWT-protected APIs
Protected transaction routes
Protected KYC routes
File type validation
File size limits
Environment-based database credentials
Server-side risk evaluation
Git exclusion of sensitive and generated files
Prototype Limitations
KYC

The KYC component performs document text extraction and pattern-based validation.

It does not provide:

Government database verification
Document authenticity verification
Face verification
Liveness detection
Official identity confirmation
Machine Learning

The fraud model is trained using synthetic PaySim data.

It is intended for prototype and learning purposes and should not be considered a production banking fraud model without further validation, real-world data, calibration, monitoring, and testing.

Future Improvements

Potential improvements include:

Real-time event streaming
Advanced anomaly detection
Explainable AI
Model monitoring
Model drift detection
Admin investigation dashboard
Role-based access control
Rate limiting
Real identity verification integration
Fraud alert notifications
Automated model retraining
Cloud deployment
Redis integration
Kafka-based transaction streaming
Advanced user behavioral profiling
Project Status
Authentication              ✅
JWT API Protection          ✅
Transaction Processing      ✅
PostgreSQL                  ✅
Rule-Based Risk Engine      ✅
PaySim Random Forest        ✅
Hybrid Risk Engine          ✅
KYC Document Processing     ✅
OCR / PDF Extraction        ✅
Transaction KYC History     ✅
React Dashboard             ✅
Fraud Detection             ✅
API Security                ✅
GitHub Version Control      ✅