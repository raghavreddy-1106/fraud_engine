from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class RiskRequest(BaseModel):
    amount: float
    hour: int
    country: str
    kycStatus: str
    transactionCount: int


@app.post("/risk-score")
def risk_score(data: RiskRequest):

    score = 0
    reasons = []

    if data.amount > 30000:
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
        "reason": " + ".join(reasons) if reasons else "Normal transaction"
    }