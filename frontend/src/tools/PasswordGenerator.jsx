import { useState } from "react";
import api from "../lib/api";
import {
  ToolSlider,
  ToolButton,
  ToolResult,
  FieldGroup,
} from "@/components/ui-kit";
import { Check, Copy } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    include_uppercase: true,
    include_lowercase: true,
    include_numbers: true,
    include_symbols: true,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = async () => {
    if (
      !options.include_uppercase &&
      !options.include_lowercase &&
      !options.include_numbers &&
      !options.include_symbols
    ) {
      setError("Please select at least one character type.");
      return;
    }
    setError("");
    setLoading(true);
    setCopied(false);
    try {
      const res = await api.post("/api/generators/password", {
        length: parseInt(length, 10),
        ...options,
      });
      setResult(res.data.password);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={1}>
        <ToolSlider
          label="Password Length"
          id="length"
          min={4}
          max={64}
          value={length}
          onChange={(v) => setLength(v)}
          showValue
        />
      </FieldGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "include_uppercase", label: "Uppercase (A-Z)" },
          { key: "include_lowercase", label: "Lowercase (a-z)" },
          { key: "include_numbers", label: "Numbers (0-9)" },
          { key: "include_symbols", label: "Symbols (!@#$)" },
        ].map((opt) => (
          <label
            key={opt.key}
            className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-md hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={options[opt.key]}
              onChange={() => toggleOption(opt.key)}
              className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)] mt-[-10px]">{error}</p>
      )}

      <ToolButton loading={loading} onClick={handleAction}>
        Generate Password
      </ToolButton>

      <ToolResult visible={!!result}>
        <div className="flex items-center justify-between gap-4 bg-[var(--color-bg-subtle)] p-4 rounded-lg border border-[var(--color-border)]">
          <div className="font-mono text-xl text-[var(--color-primary)] truncate break-all overflow-hidden">
            {result}
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-[var(--color-bg-hover)] rounded-md transition-colors flex-shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={20} className="text-[var(--color-success)]" />
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>
      </ToolResult>
    </div>
  );
}
