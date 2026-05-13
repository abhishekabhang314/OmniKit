import { useState } from "react";
import axios from "axios";
import { ArrowLeftRight } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = {
  length: {
    units: ["meter", "kilometer", "mile", "yard", "foot", "inch", "centimeter", "millimeter"],
  },
  weight: {
    units: ["kilogram", "gram", "pound", "ounce", "ton"],
  },
  temperature: {
    units: ["celsius", "fahrenheit", "kelvin"],
  },
  speed: {
    units: ["meter_per_second", "kilometer_per_hour", "mile_per_hour", "knot"],
  },
  area: {
    units: ["square_meter", "square_kilometer", "square_mile", "acre", "hectare"],
  },
};

const CATEGORY_LABELS = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  speed: "Speed",
  area: "Area",
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
    <div className="tool-page-wrap">
      {/* Category tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            className={`tag${category === cat ? " active" : ""}`}
            onClick={() => handleCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Value input */}
      <div className="tool-field-group">
        <label className="field-label" htmlFor="uc-value">Value</label>
        <input
          id="uc-value"
          type="number"
          className="input-field mono"
          placeholder="Enter value..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && convert()}
        />
      </div>

      {/* From / Swap / To */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "var(--space-3)", alignItems: "end" }}>
        <div className="tool-field-group">
          <label className="field-label" htmlFor="uc-from">From</label>
          <select id="uc-from" className="select-field" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>{UNIT_LABELS[u] || u}</option>
            ))}
          </select>
        </div>

        <button
          className="btn-icon"
          onClick={swap}
          title="Swap units"
          style={{
            width: 40, height: 40,
            border: "1.5px solid var(--color-border)",
            borderRadius: "50%",
            background: "var(--color-surface)",
            transition: "transform var(--transition-base), border-color var(--transition-base)",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "rotate(180deg)"}
          onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg)"}
        >
          <ArrowLeftRight size={16} />
        </button>

        <div className="tool-field-group">
          <label className="field-label" htmlFor="uc-to">To</label>
          <select id="uc-to" className="select-field" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>{UNIT_LABELS[u] || u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Convert button */}
      <button className="btn-primary full-width" onClick={convert} disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Converting..." : "Convert"}
      </button>

      {/* Error */}
      <ErrorMessage message={error} />

      {/* Result */}
      {result !== null && (
        <div className="tool-result-box primary-accent animate-fadeup" style={{ textAlign: "center" }}>
          <div className="result-label">Result</div>
          <div className="result-number">
            {typeof result === "number"
              ? result.toLocaleString("en-IN", { maximumFractionDigits: 8 })
              : result}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--color-text-muted)", margin: "var(--space-1) 0 var(--space-3)" }}>
            {UNIT_LABELS[toUnit] || toUnit}
          </div>
          {formula && <div className="result-formula">{formula}</div>}
        </div>
      )}
    </div>
  );
}