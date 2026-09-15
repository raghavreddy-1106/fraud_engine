import { useState } from "react";

function KYCVerification() {
  const [documentType, setDocumentType] = useState("PAN");
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!document) {
      setMessage("Please select a document.");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("userId", "1");
    formData.append("documentType", documentType);
    formData.append("document", document);

    try {
      const response = await fetch(
        "http://localhost:3000/api/kyc/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "KYC verification failed");
        return;
      }

      setStatus(data.kyc?.kyc_status || "PENDING");
      setMessage(data.message || "KYC processed successfully");
    } catch (error) {
      console.error(error);
      setMessage("Backend unavailable");
    }
  };

  return (
    <div className="form-card">
      <h2>KYC Verification</h2>

      <p className="form-subtitle">
        Upload an identity document for verification.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Document Type</label>

          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option value="PAN">PAN</option>
            <option value="AADHAAR">Aadhaar</option>
            <option value="PASSPORT">Passport</option>
          </select>
        </div>

        <div className="field">
          <label>Identity Document</label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setDocument(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">
          Verify KYC
        </button>
      </form>

      {message && (
        <p className="transaction-message">
          {message}
        </p>
      )}

      {status && (
        <p className={`kyc-result ${status.toLowerCase()}`}>
          KYC Status: {status}
        </p>
      )}
    </div>
  );
}

export default KYCVerification;