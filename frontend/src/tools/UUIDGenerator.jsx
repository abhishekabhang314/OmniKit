import { useState } from "react";
import api from "../lib/api";
import {
  ToolSlider,
  ToolButton,
  ToolResult,
  FieldGroup,
} from "@/components/ui-kit";
import { Check, Copy } from "lucide-react";

export default function UUIDGenerator() {
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState({
    uppercase: false,
    remove_hyphens: false,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [copiedAll, setCopiedAll] = useState(false);

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = async () => {
    setError("");
    setLoading(true);
    setCopiedIndex(-1);
    setCopiedAll(false);
    try {
      const res = await api.post("/api/generators/uuid", {
        count: parseInt(count, 10),
        ...options,
      });
      setResults(res.data.uuids);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(results.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={1}>
        <ToolSlider
          label="Number of UUIDs"
          id="count"
          min={1}
          max={50}
          value={count}
          onChange={(v) => setCount(v)}
          showValue
        />
      </FieldGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "uppercase", label: "Uppercase" },
          { key: "remove_hyphens", label: "Remove Hyphens (-)" },
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
        Generate UUIDs
      </ToolButton>

      <ToolResult visible={results.length > 0}>
        <div className="flex flex-col gap-2">
          {results.length > 1 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={copyAllToClipboard}
                className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                {copiedAll ? <Check size={16} /> : <Copy size={16} />}
                {copiedAll ? "Copied All!" : "Copy All"}
              </button>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {results.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 bg-[var(--color-bg-subtle)] p-3 rounded-lg border border-[var(--color-border)]"
              >
                <div className="font-mono text-sm sm:text-base text-[var(--color-text-primary)] truncate">
                  {uuid}
                </div>
                <button
                  onClick={() => copyToClipboard(uuid, i)}
                  className="p-1.5 hover:bg-[var(--color-bg-hover)] rounded-md transition-colors flex-shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                  title="Copy to clipboard"
                >
                  {copiedIndex === i ? (
                    <Check size={18} className="text-[var(--color-success)]" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </ToolResult>
    </div>
  );
}
