import { useState, useRef } from "react";
import axios from "axios";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null); // null | "uploading" | { chunks: number } | "error"
  const [docs, setDocs] = useState([
    // placeholder — replace with real fetched list if your backend supports it
  ]);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f) setFile(f);
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setStatus("uploading");

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const chunks = res.data.chunks;
      setStatus({ chunks });
      setDocs((prev) => [...prev, { name: file.name, chunks }]);
      setFile(null);

      // hide success pill after 3 s
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  return (
    <>
      {/* Sidebar header */}
      <div className="sidebar-header">
        <h2>🗄️ Knowledge base</h2>
        <p>Upload documents to chat with your data</p>
      </div>

      {/* Drop zone */}
      <div
        className="upload-zone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="upload-icon">☁️</div>
        <p>{file ? file.name : "Drop files here or click to browse"}</p>
        <span>PDF, DOCX, TXT up to 20 MB</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Upload button */}
      <button
        className="upload-btn"
        onClick={uploadFile}
        disabled={!file || status === "uploading"}
      >
        {status === "uploading" ? "Uploading…" : "⬆ Upload document"}
      </button>

      {/* Status pill */}
      {status && status !== "uploading" && (
        <div
          className="status-pill"
          style={status === "error" ? { color: "#f87171", background: "rgba(248,113,113,0.1)" } : {}}
        >
          {status === "error"
            ? "✗ Upload failed"
            : `✔ Uploaded — ${status.chunks} chunks`}
        </div>
      )}

      {/* Indexed docs list */}
      <div className="docs-section">
        {docs.length > 0 && (
          <>
            <p className="docs-label">Indexed documents</p>
            {docs.map((doc, i) => (
              <div key={i} className="doc-item">
                <span>📄</span>
                <span className="doc-name">{doc.name}</span>
                <span className="doc-chunks">{doc.chunks} ch</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}