import { useState } from "react";
import api from "../lib/api";
import {
  ToolInput,
  ToolButton,
  ToolResult,
  FieldGroup,
} from "@/components/ui-kit";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async () => {
    if (!weight || !height) {
      setError("Please enter both weight and height.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/api/calculators/bmi", {
        weight_kg: parseFloat(weight),
        height_cm: parseFloat(height),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid input.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal weight":
        return "text-green-500";
      case "Overweight":
        return "text-yellow-500";
      case "Obesity":
        return "text-red-500";
      default:
        return "text-[var(--color-primary)]";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={2}>
        <ToolInput
          label="Weight (kg)"
          id="weight"
          type="number"
          placeholder="e.g. 70"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <ToolInput
          label="Height (cm)"
          id="height"
          type="number"
          placeholder="e.g. 175"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </FieldGroup>

      {error && (
        <p className="text-sm text-[var(--color-error)] mt-[-10px]">{error}</p>
      )}

      <ToolButton loading={loading} onClick={handleAction}>
        Calculate BMI
      </ToolButton>

      <ToolResult visible={!!result}>
        {result && (
          <div className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] gap-2">
            <div className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
              Your BMI
            </div>
            <div className="text-5xl font-black text-[var(--color-text-primary)]">
              {result.bmi}
            </div>
            <div
              className={`text-xl font-bold mt-2 ${getCategoryColor(result.category)}`}
            >
              {result.category}
            </div>
          </div>
        )}
      </ToolResult>
    </div>
  );
}
