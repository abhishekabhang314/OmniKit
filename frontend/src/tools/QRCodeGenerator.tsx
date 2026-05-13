import { useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";

export default function QRCodeGenerator() {
  const [content, setContent] = useState("");
  const [size, setSize] = useState(10);
  const [border, setBorder] = useState(4);
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!content.trim()) {
      setError("Please enter some text or a URL.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/generators/qr-code", { content, size, border });
      setQrImage(res.data.image_base64);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="tool-page-wrap">
      {/* Text / URL input */}
      <div className="tool-field-group">
        <label className="field-label" htmlFor="qr-content">Text or URL</label>
        <textarea
          id="qr-content"
          className="input-field mono"
          rows={3}
          placeholder="https://example.com"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && generate()}
          style={{ resize: "none" }}
        />
      </div>

      {/* Sliders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <div className="tool-field-group">
          <label className="field-label" htmlFor="qr-size">
            Size
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)", marginLeft: 8 }}>
              {size}
            </span>
          </label>
          <input
            id="qr-size"
            type="range"
            className="slider-field"
            min={5} max={20}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>
        <div className="tool-field-group">
          <label className="field-label" htmlFor="qr-border">
            Border
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)", marginLeft: 8 }}>
              {border}
            </span>
          </label>
          <input
            id="qr-border"
            type="range"
            className="slider-field"
            min={1} max={10}
            value={border}
            onChange={(e) => setBorder(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Generate button */}
      <button
        className="btn-primary full-width"
        onClick={generate}
        disabled={loading}
      >
        {loading && <span className="spinner" />}
        {loading ? "Generating..." : "Generate QR Code"}
      </button>

      {/* Error */}
      <ErrorMessage message={error} />

      {/* Result */}
      {qrImage && (
        <div className="tool-result-box animate-fadeup" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            padding: "var(--space-4)",
            background: "#fff",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "var(--space-4)",
          }}>
            <img
              src={qrImage}
              alt="Generated QR Code"
              width={size * 20}
              height={size * 20}
              style={{ display: "block", borderRadius: 4 }}
            />
          </div>
          <br />
          <button className="btn-outline" onClick={download}>
            <Download size={16} />
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}