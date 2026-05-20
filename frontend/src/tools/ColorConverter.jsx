import { useState } from "react";
import api from "../lib/api";
import {
  ToolInput,
  ToolButton,
  ToolResult,
  FieldGroup,
} from "@/components/ui-kit";
import { Check, Copy } from "lucide-react";

export default function ColorConverter() {
  const [colorInput, setColorInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  const handleAction = async () => {
    if (!colorInput) {
      setError("Please enter a color value.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setCopiedKey(null);
    try {
      const res = await api.post("/api/converters/color", {
        color: colorInput,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid color format.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={1}>
        <ToolInput
          label="Color Value (HEX, RGB, or HSL)"
          id="color-input"
          placeholder="e.g. #3b82f6 or rgb(59, 130, 246)"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          error={error}
        />
      </FieldGroup>

      <ToolButton loading={loading} onClick={handleAction}>
        Convert Color
      </ToolButton>

      <ToolResult visible={!!result}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg shadow-sm border border-[var(--color-border)] flex-shrink-0"
              style={{ backgroundColor: result?.hex }}
            ></div>
            <div className="text-[var(--color-text-secondary)] text-sm">
              Color Preview
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {result &&
              [
                { key: "hex", label: "HEX", value: result.hex },
                { key: "rgb", label: "RGB", value: result.rgb },
                { key: "hsl", label: "HSL", value: result.hsl },
              ].map((fmt) => (
                <div key={fmt.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">
                    {fmt.label}
                  </label>
                  <div className="flex items-center justify-between gap-4 bg-[var(--color-bg-subtle)] p-3 rounded-lg border border-[var(--color-border)]">
                    <div className="font-mono text-[var(--color-text-primary)]">
                      {fmt.value}
                    </div>
                    <button
                      onClick={() => copyToClipboard(fmt.value, fmt.key)}
                      className="p-1.5 hover:bg-[var(--color-bg-hover)] rounded-md transition-colors flex-shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                      title="Copy to clipboard"
                    >
                      {copiedKey === fmt.key ? (
                        <Check
                          size={18}
                          className="text-[var(--color-success)]"
                        />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </ToolResult>
    </div>
  );
}
