import { useState } from "react";
import api from "../lib/api";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ToolInput,
  ToolSelect,
  ToolButton,
  ToolResult,
  FieldGroup,
} from "@/components/ui-kit";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/Tabs";
import { CopyButton } from "@/components/animate-ui/buttons/CopyButton";

const CATEGORIES = {
  length: {
    units: [
      "meter",
      "kilometer",
      "mile",
      "yard",
      "foot",
      "inch",
      "centimeter",
      "millimeter",
    ],
  },
  weight: { units: ["kilogram", "gram", "pound", "ounce", "ton"] },
  temperature: { units: ["celsius", "fahrenheit", "kelvin"] },
  speed: {
    units: ["meter_per_second", "kilometer_per_hour", "mile_per_hour", "knot"],
  },
  area: {
    units: [
      "square_meter",
      "square_kilometer",
      "square_mile",
      "acre",
      "hectare",
    ],
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
  meter: "Meter",
  kilometer: "Kilometer",
  mile: "Mile",
  yard: "Yard",
  foot: "Foot",
  inch: "Inch",
  centimeter: "Centimeter",
  millimeter: "Millimeter",
  kilogram: "Kilogram",
  gram: "Gram",
  pound: "Pound",
  ounce: "Ounce",
  ton: "Ton",
  celsius: "Celsius °C",
  fahrenheit: "Fahrenheit °F",
  kelvin: "Kelvin K",
  meter_per_second: "m/s",
  kilometer_per_hour: "km/h",
  mile_per_hour: "mph",
  knot: "Knot",
  square_meter: "m²",
  square_kilometer: "km²",
  square_mile: "mi²",
  acre: "Acre",
  hectare: "Hectare",
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
    if (!value && value !== 0) {
      setError("Please enter a value.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/converters/unit", {
        value: parseFloat(value),
        from_unit: fromUnit,
        to_unit: toUnit,
      });
      setResult(res.data.result);
      setFormula(res.data.formula);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Conversion failed. These units may be incompatible.",
      );
    } finally {
      setLoading(false);
    }
  };

  const options = CATEGORIES[category].units.map((u) => ({
    value: u,
    label: UNIT_LABELS[u] || u,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={category} onValueChange={handleCategory}>
        <TabsList>
          {Object.keys(CATEGORIES).map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ToolInput
        label="Value"
        id="uc-value"
        type="number"
        placeholder="Enter value..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && convert()}
        error={error}
      />

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <ToolSelect
          label="From"
          id="uc-from"
          options={options}
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-[46px] w-[46px] rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] border-[1.5px] border-[var(--color-border)] group mb-[1px]"
          onClick={swap}
          title="Swap units"
        >
          <ArrowLeftRight
            size={18}
            className="transition-transform group-hover:rotate-180"
          />
        </Button>
        <ToolSelect
          label="To"
          id="uc-to"
          options={options}
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
        />
      </div>

      <ToolButton loading={loading} onClick={convert}>
        Convert
      </ToolButton>

      <ToolResult
        visible={result !== null}
        className="primary-accent text-center relative pt-8 pb-6"
      >
        <div className="absolute top-4 right-4">
          <CopyButton text={String(result)} />
        </div>
        <div className="result-label">Result</div>
        <div className="result-number">
          {typeof result === "number"
            ? result.toLocaleString("en-IN", { maximumFractionDigits: 8 })
            : result}
        </div>
        <div className="text-[13px] text-[var(--color-text-muted)] my-2 font-medium">
          {UNIT_LABELS[toUnit] || toUnit}
        </div>
        {formula && <div className="result-formula mt-2">{formula}</div>}
      </ToolResult>
    </div>
  );
}
