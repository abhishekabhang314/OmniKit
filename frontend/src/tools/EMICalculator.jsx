import { useState } from "react";
import axios from "axios";

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
    <div style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .emi-wrap * { box-sizing: border-box; }

        .emi-wrap {
          font-family: 'Instrument Sans', sans-serif;
          color: #1a1a1a;
        }

        .emi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .emi-field { display: flex; flex-direction: column; gap: 6px; }

        .emi-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
        }

        .emi-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .emi-prefix {
          position: absolute;
          left: 12px;
          font-size: 14px;
          color: #aaa;
          font-weight: 500;
          pointer-events: none;
        }

        .emi-input {
          width: 100%;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          padding: 12px 12px 12px 28px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fafafa;
        }
        .emi-input:focus {
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }
        .emi-input.no-prefix { padding-left: 12px; }

        .emi-btn {
          width: 100%;
          padding: 14px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .emi-btn:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
        .emi-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .emi-error {
          margin-top: 12px;
          padding: 11px 14px;
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 13px;
        }

        .emi-result {
          margin-top: 24px;
          animation: fadeUp 0.35s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .emi-hero {
          background: #1a1a1a;
          border-radius: 14px;
          padding: 28px;
          text-align: center;
          margin-bottom: 16px;
        }

        .emi-hero-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }

        .emi-hero-amount {
          font-family: 'Instrument Serif', serif;
          font-size: 48px;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }

        .emi-hero-sub {
          font-size: 12px;
          color: #555;
          font-style: italic;
        }

        .emi-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .emi-stat {
          background: #f7f7f7;
          border-radius: 12px;
          padding: 18px;
        }

        .emi-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 6px;
        }

        .emi-stat-value {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: #1a1a1a;
        }

        .emi-bar-wrap { margin-bottom: 20px; }

        .emi-bar-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
          color: #888;
        }

        .emi-bar {
          height: 8px;
          border-radius: 4px;
          background: #e5e5e5;
          overflow: hidden;
        }

        .emi-bar-fill {
          height: 100%;
          background: #1a1a1a;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .emi-toggle {
          width: 100%;
          padding: 11px;
          background: transparent;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .emi-toggle:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .emi-schedule {
          margin-top: 16px;
          border: 1.5px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
          animation: fadeUp 0.3s ease;
        }

        .emi-schedule table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .emi-schedule thead {
          background: #f7f7f7;
        }

        .emi-schedule th {
          padding: 10px 14px;
          text-align: right;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
        }
        .emi-schedule th:first-child { text-align: left; }

        .emi-schedule td {
          padding: 10px 14px;
          text-align: right;
          color: #444;
          border-top: 1px solid #f0f0f0;
        }
        .emi-schedule td:first-child { text-align: left; color: #888; font-size: 12px; }

        .emi-schedule tbody tr:hover { background: #fafafa; }

        .emi-schedule-wrap {
          max-height: 280px;
          overflow-y: auto;
        }
        .emi-schedule-wrap::-webkit-scrollbar { width: 4px; }
        .emi-schedule-wrap::-webkit-scrollbar-track { background: #f7f7f7; }
        .emi-schedule-wrap::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
      `}</style>

      <div className="emi-wrap">
        {/* Inputs */}
        <div className="emi-grid">
          <div className="emi-field">
            <label className="emi-label">Loan Amount</label>
            <div className="emi-input-wrap">
              <span className="emi-prefix">₹</span>
              <input
                type="number" className="emi-input"
                placeholder="500000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>
          </div>
          <div className="emi-field">
            <label className="emi-label">Interest Rate</label>
            <div className="emi-input-wrap">
              <span className="emi-prefix">%</span>
              <input
                type="number" className="emi-input"
                placeholder="8.5" step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
          </div>
          <div className="emi-field">
            <label className="emi-label">Tenure (months)</label>
            <div className="emi-input-wrap">
              <input
                type="number" className="emi-input no-prefix"
                placeholder="60"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button className="emi-btn" onClick={calculate} disabled={loading}>
          {loading ? "Calculating..." : "Calculate EMI"}
        </button>

        {error && <div className="emi-error">⚠ {error}</div>}

        {result && (
          <div className="emi-result">
            {/* Hero EMI */}
            <div className="emi-hero">
              <div className="emi-hero-label">Monthly EMI</div>
              <div className="emi-hero-amount">{fmt(result.emi)}</div>
              <div className="emi-hero-sub">per month for {tenure} months</div>
            </div>

            {/* Stats */}
            <div className="emi-stats">
              <div className="emi-stat">
                <div className="emi-stat-label">Total Payment</div>
                <div className="emi-stat-value">{fmt(result.total_payment)}</div>
              </div>
              <div className="emi-stat">
                <div className="emi-stat-label">Total Interest</div>
                <div className="emi-stat-value">{fmt(result.total_interest)}</div>
              </div>
            </div>

            {/* Principal vs Interest bar */}
            <div className="emi-bar-wrap">
              <div className="emi-bar-labels">
                <span>Principal — {principalPct}%</span>
                <span>Interest — {interestPct}%</span>
              </div>
              <div className="emi-bar">
                <div className="emi-bar-fill" style={{ width: `${principalPct}%` }} />
              </div>
            </div>

            {/* Schedule toggle */}
            <button className="emi-toggle" onClick={() => setShowSchedule(!showSchedule)}>
              {showSchedule ? "▲ Hide" : "▼ Show"} repayment schedule
            </button>

            {showSchedule && (
              <div className="emi-schedule">
                <div className="emi-schedule-wrap">
                  <table>
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
    </div>
  );
}