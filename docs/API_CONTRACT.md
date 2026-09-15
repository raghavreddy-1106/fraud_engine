# API Contract

## 1. Authentication

### POST /api/auth/login

Request:
{
  "email": "user@test.com",
  "password": "123456"
}

Response:
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Test User",
    "role": "USER"
  }
}

---

## 2. Create Transaction

### POST /api/transactions

Request:
{
  "userId": 1,
  "amount": 50000,
  "currency": "EUR",
  "destinationCountry": "FR"
}

Response:
{
  "id": 101,
  "amount": 50000,
  "currency": "EUR",
  "riskScore": 82,
  "riskLevel": "HIGH",
  "status": "BLOCKED",
  "reason": "High amount + unusual transaction time"
}

---

## 3. Get Transactions

### GET /api/transactions

Response:
[
  {
    "id": 101,
    "userId": 1,
    "amount": 50000,
    "currency": "EUR",
    "riskScore": 82,
    "riskLevel": "HIGH",
    "status": "BLOCKED"
  }
]

---

## 4. Get Transaction

### GET /api/transactions/:id

Response:
{
  "id": 101,
  "userId": 1,
  "amount": 50000,
  "currency": "EUR",
  "riskScore": 82,
  "riskLevel": "HIGH",
  "status": "BLOCKED"
}

---

## 5. Risk Scoring

### POST /risk-score

Request:
{
  "amount": 50000,
  "hour": 2,
  "country": "FR",
  "kycStatus": "VERIFIED",
  "transactionCount": 15
}

Response:
{
  "riskScore": 82,
  "riskLevel": "HIGH",
  "reason": "High amount + unusual time"
}