import { useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const calculate = async () => {
    if (!principal || !rate || !tenure) {
      setError("Please fill in all three fields.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("/api/calculators/emi", {
        principal: parseFloat(principal),
        annual_rate: parseFloat(rate),
        tenure_months: parseInt(tenure),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const principalPct = result
    ? ((result.principal / result.total_payment) * 100).toFixed(1)
    : 0;
  const interestPct = result
    ? ((result.total_interest / result.total_payment) * 100).toFixed(1)
    : 0;

  return (
    <div className="tool-page-wrap">
      {/* Inputs grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)" }}>
        <div className="tool-field-group">
          <label className="field-label" htmlFor="emi-principal">Loan Amount (₹)</label>
          <input
            id="emi-principal"
            type="number"
            className="input-field"
            placeholder="500000"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="tool-field-group">
          <label className="field-label" htmlFor="emi-rate">Interest Rate (%)</label>
          <input
            id="emi-rate"
            type="number"
            className="input-field"
            placeholder="8.5"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="tool-field-group">
          <label className="field-label" htmlFor="emi-tenure">Tenure (months)</label>
          <input
            id="emi-tenure"
            type="number"
            className="input-field"
            placeholder="60"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </div>
      </div>

      {/* Calculate button */}
      <button className="btn-primary full-width" onClick={calculate} disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Calculating..." : "Calculate EMI"}
      </button>

      {/* Error */}
      <ErrorMessage message={error} />

      {/* Result */}
      {result && (
        <div className="animate-fadeup" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {/* Hero EMI */}
          <div className="tool-result-box" style={{
            background: "var(--color-primary)",
            border: "none",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>
              Monthly EMI
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 500, color: "#fff", lineHeight: 1 }}>
              {fmt(result.emi)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
              per month for {tenure} months
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-label">Total Payment</div>
              <div className="stat-card-value">{fmt(result.total_payment)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Total Interest</div>
              <div className="stat-card-value">{fmt(result.total_interest)}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="tool-result-box" style={{ padding: "var(--space-4)" }}>
            <div className="progress-bar-labels">
              <span>Principal — {principalPct}%</span>
              <span>Interest — {interestPct}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${principalPct}%` }} />
            </div>
          </div>

          {/* Schedule toggle */}
          <button
            className="btn-ghost full-width"
            onClick={() => setShowSchedule(!showSchedule)}
            style={{ border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)" }}
          >
            {showSchedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showSchedule ? "Hide" : "Show"} repayment schedule
          </button>

          {showSchedule && (
            <div className="schedule-table-wrap animate-fadeup">
              <div className="schedule-table-scroll">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>EMI</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{fmt(row.emi)}</td>
                        <td>{fmt(row.principal_paid)}</td>
                        <td>{fmt(row.interest_paid)}</td>
                        <td>{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}