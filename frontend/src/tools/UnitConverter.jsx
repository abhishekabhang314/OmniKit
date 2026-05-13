import { useState } from "react";
import axios from "axios";

const CATEGORIES = {
  length: {
    icon: "📏",
    units: ["meter", "kilometer", "mile", "yard", "foot", "inch", "centimeter", "millimeter"],
  },
  weight: {
    icon: "⚖️",
    units: ["kilogram", "gram", "pound", "ounce", "ton"],
  },
  temperature: {
    icon: "🌡️",
    units: ["celsius", "fahrenheit", "kelvin"],
  },
  speed: {
    icon: "💨",
    units: ["meter_per_second", "kilometer_per_hour", "mile_per_hour", "knot"],
  },
  area: {
    icon: "📐",
    units: ["square_meter", "square_kilometer", "square_mile", "acre", "hectare"],
  },
};

const UNIT_LABELS = {
  meter: "Meter", kilometer: "Kilometer", mile: "Mile", yard: "Yard",
  foot: "Foot", inch: "Inch", centimeter: "Centimeter", millimeter: "Millimeter",
  kilogram: "Kilogram", gram: "Gram", pound: "Pound", ounce: "Ounce", ton: "Ton",
  celsius: "Celsius °C", fahrenheit: "Fahrenheit °F", kelvin: "Kelvin K",
  meter_per_second: "m/s", kilometer_per_hour: "km/h", mile_per_hour: "mph", knot: "Knot",
  square_meter: "m²", square_kilometer: "km²", square_mile: "mi²", acre: "Acre", hectare: "Hectare",
};

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [result, setResult] = useState(null);
  const [formula, setFormula] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCategory = (cat) => {
    setCategory(cat);
    setFromUnit(CATEGORIES[cat].units[0]);
    setToUnit(CATEGORIES[cat].units[1]);
    setResult(null);
    setFormula("");
    setError("");
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  };

  const convert = async () => {
    if (!value && value !== 0) { setError("Please enter a value."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/converters/unit", {
        value: parseFloat(value),
        from_unit: fromUnit,
        to_unit: toUnit,
      });
      setResult(res.data.result);
      setFormula(res.data.formula);
    } catch (err) {
      setError(err.response?.data?.detail || "Conversion failed. These units may be incompatible.");
    } finally {
      setLoading(false);
    }
  };

  const units = CATEGORIES[category].units;

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .uc-wrap * { box-sizing: border-box; }
        .uc-wrap { font-family: 'Space Grotesk', sans-serif; }

        /* Category tabs */
        .uc-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .uc-tab {
          padding: 7px 14px;
          border-radius: 999px;
          border: 1.5px solid #e0e0e0;
          background: transparent;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #888;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .uc-tab:hover { border-color: #4f46e5; color: #4f46e5; }
        .uc-tab.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #fff;
        }

        /* Main conversion row */
        .uc-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 10px;
          align-items: end;
          margin-bottom: 16px;
        }

        .uc-field { display: flex; flex-direction: column; gap: 6px; }

        .uc-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
        }

        .uc-select {
          width: 100%;
          padding: 11px 12px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          background: #fafafa;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23aaa' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
        .uc-select:focus { border-color: #4f46e5; background-color: #fff; }

        .uc-input {
          width: 100%;
          padding: 11px 12px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 15px;
          font-weight: 400;
          color: #1a1a1a;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .uc-input:focus {
          border-color: #4f46e5;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
        }

        .uc-swap {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: border-color 0.2s, transform 0.2s;
          flex-shrink: 0;
          align-self: center;
          margin-top: 18px;
        }
        .uc-swap:hover { border-color: #4f46e5; transform: rotate(180deg); }

        .uc-btn {
          width: 100%;
          padding: 13px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .uc-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); }
        .uc-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .uc-error {
          margin-top: 12px;
          padding: 11px 14px;
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 13px;
        }

        .uc-result {
          margin-top: 20px;
          background: linear-gradient(135deg, #f0f0ff 0%, #fafafa 100%);
          border: 1.5px solid #e0dfff;
          border-radius: 14px;
          padding: 24px;
          text-align: center;
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .uc-result-number {
          font-family: 'Space Mono', monospace;
          font-size: 36px;
          font-weight: 700;
          color: #4f46e5;
          line-height: 1.1;
          margin-bottom: 4px;
          word-break: break-all;
        }

        .uc-result-unit {
          font-size: 13px;
          color: #888;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .uc-result-formula {
          display: inline-block;
          padding: 6px 14px;
          background: #fff;
          border: 1px solid #e0dfff;
          border-radius: 999px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #666;
        }
      `}</style>

      <div className="uc-wrap">
        {/* Category tabs */}
        <div className="uc-tabs">
          {Object.entries(CATEGORIES).map(([cat, meta]) => (
            <button
              key={cat}
              className={`uc-tab ${category === cat ? "active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {meta.icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Value input */}
        <div className="uc-field" style={{ marginBottom: 12 }}>
          <label className="uc-label">Value</label>
          <input
            type="number"
            className="uc-input"
            placeholder="Enter value..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && convert()}
          />
        </div>

        {/* From / Swap / To */}
        <div className="uc-row">
          <div className="uc-field">
            <label className="uc-label">From</label>
            <select className="uc-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {units.map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u] || u}</option>
              ))}
            </select>
          </div>

          <button className="uc-swap" onClick={swap} title="Swap units">⇄</button>

          <div className="uc-field">
            <label className="uc-label">To</label>
            <select className="uc-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {units.map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u] || u}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="uc-btn" onClick={convert} disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>

        {error && <div className="uc-error">⚠ {error}</div>}

        {result !== null && (
          <div className="uc-result">
            <div className="uc-result-number">
              {typeof result === "number" ? result.toLocaleString("en-IN", { maximumFractionDigits: 8 }) : result}
            </div>
            <div className="uc-result-unit">{UNIT_LABELS[toUnit] || toUnit}</div>
            <div className="uc-result-formula">{formula}</div>
          </div>
        )}
      </div>
    </div>
  );
}