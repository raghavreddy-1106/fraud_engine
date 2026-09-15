from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from pathlib import Path

app = FastAPI()

# =========================================================
# LOAD PAYSIM ML MODEL
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

paysim_model = joblib.load(
    BASE_DIR / "paysim_fraud_model.pkl"
)

paysim_preprocessor = joblib.load(
    BASE_DIR / "paysim_preprocessor.pkl"
)


# =========================================================
# RULE-BASED RISK REQUEST
# =========================================================

class RiskRequest(BaseModel):
    amount: float
    hour: int
    country: str
    kycStatus: str
    transactionCount: int


# =========================================================
# PAYSIM ML REQUEST
# =========================================================

class PaySimRiskRequest(BaseModel):
    step: int
    type: str
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float
    isFlaggedFraud: int


# =========================================================
# RULE-BASED RISK ENGINE
# =========================================================

@app.post("/risk-score")
def risk_score(data: RiskRequest):

    score = 0
    reasons = []

    if data.amount >= 100000:
        score += 50
        reasons.append("Very high transaction amount")

    elif data.amount > 30000:
        score += 30
        reasons.append("High transaction amount")

    if data.hour < 6 or data.hour > 22:
        score += 20
        reasons.append("Unusual transaction time")

    if data.transactionCount < 3:
        score += 20
        reasons.append("New or low-history account")

    if data.kycStatus != "VERIFIED":
        score += 30
        reasons.append("KYC not verified")

    score = min(score, 100)

    if score >= 70:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "riskScore": score,
        "riskLevel": level,
        "reason": " + ".join(reasons)
        if reasons
        else "Normal transaction"
    }


# =========================================================
# PAYSIM ML RISK ENGINE
# =========================================================

@app.post("/ml-risk-paysim")
def ml_risk_paysim(data: PaySimRiskRequest):

    values = data.model_dump()

    df = pd.DataFrame([values])

    # Apply same preprocessing used during training
    df = paysim_preprocessor.transform(df)

    prediction = int(
        paysim_model.predict(df)[0]
    )

    probability = float(
        paysim_model.predict_proba(df)[0][1]
    )

    if probability >= 0.70:
        risk_level = "HIGH"
        reason = "ML model detected high fraud probability"

    elif probability >= 0.30:
        risk_level = "MEDIUM"
        reason = "ML model detected elevated fraud probability"

    else:
        risk_level = "LOW"
        reason = "ML model indicates normal transaction behavior"

    return {
        "fraudPrediction": prediction,
        "fraudProbability": round(probability * 100, 2),
        "riskLevel": risk_level,
        "reason": reason
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "OK",
        "paysimModelLoaded": True
    }