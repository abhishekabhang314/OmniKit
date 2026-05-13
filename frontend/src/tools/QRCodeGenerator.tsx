import { useState } from "react";
import axios from "axios";

export default function QRCodeGenerator() {
  const [content, setContent] = useState("");
  const [size, setSize] = useState(10);
  const [border, setBorder] = useState(4);
  const [qrImage, setQrImage] = useState<string | null>(null);
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
      const res = await axios.post("/api/generators/qr-code", {
        content,
        size,
        border,
      });
      setQrImage(res.data.image_base64);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
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
    <div style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');

        .qr-wrap * { box-sizing: border-box; }

        .qr-wrap {
          background: #0d0d0d;
          border-radius: 16px;
          padding: 32px;
          color: #f0f0f0;
          font-family: 'DM Mono', monospace;
        }

        .qr-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }

        .qr-input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 14px 16px;
          color: #f0f0f0;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
        }
        .qr-input:focus { border-color: #e8ff47; }
        .qr-input::placeholder { color: #444; }

        .qr-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .qr-slider-wrap {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .qr-slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .qr-slider-val {
          font-size: 18px;
          font-weight: 500;
          color: #e8ff47;
        }

        .qr-slider {
          width: 100%;
          -webkit-appearance: none;
          height: 3px;
          border-radius: 2px;
          background: #2a2a2a;
          outline: none;
          cursor: pointer;
        }
        .qr-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e8ff47;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .qr-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }

        .qr-btn {
          width: 100%;
          margin-top: 20px;
          padding: 15px;
          background: #e8ff47;
          color: #0d0d0d;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
        }
        .qr-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .qr-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .qr-error {
          margin-top: 12px;
          padding: 12px 14px;
          background: #1f0a0a;
          border: 1px solid #5a1a1a;
          border-radius: 8px;
          color: #ff6b6b;
          font-size: 13px;
        }

        .qr-result {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          animation: fadeUp 0.4s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .qr-image-frame {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 0 0 1px #2a2a2a, 0 20px 60px rgba(232,255,71,0.08);
        }

        .qr-image-frame img { display: block; border-radius: 4px; }

        .qr-download {
          padding: 12px 28px;
          background: transparent;
          border: 1px solid #e8ff47;
          border-radius: 10px;
          color: #e8ff47;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .qr-download:hover { background: #e8ff47; color: #0d0d0d; }

        .qr-spinner {
          width: 22px; height: 22px;
          border: 2px solid #0d0d0d;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="qr-wrap">
        {/* Input */}
        <div>
          <div className="qr-label">Text or URL</div>
          <textarea
            className="qr-input"
            rows={3}
            placeholder="https://example.com"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && generate()}
          />
        </div>

        {/* Sliders */}
        <div className="qr-row">
          <div className="qr-slider-wrap">
            <div className="qr-slider-header">
              <span className="qr-label" style={{ margin: 0 }}>Size</span>
              <span className="qr-slider-val">{size}</span>
            </div>
            <input
              type="range" className="qr-slider"
              min={5} max={20} value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
          <div className="qr-slider-wrap">
            <div className="qr-slider-header">
              <span className="qr-label" style={{ margin: 0 }}>Border</span>
              <span className="qr-slider-val">{border}</span>
            </div>
            <input
              type="range" className="qr-slider"
              min={1} max={10} value={border}
              onChange={(e) => setBorder(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Generate button */}
        <button className="qr-btn" onClick={generate} disabled={loading}>
          {loading ? <><span className="qr-spinner" />Generating...</> : "Generate QR Code"}
        </button>

        {/* Error */}
        {error && <div className="qr-error">⚠ {error}</div>}

        {/* Result */}
        {qrImage && (
          <div className="qr-result">
            <div className="qr-image-frame">
              <img src={qrImage} alt="Generated QR Code" width={size * 20} height={size * 20} />
            </div>
            <button className="qr-download" onClick={download}>
              ↓ Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}