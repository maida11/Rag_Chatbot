import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        question: input,
      });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to backend." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-box">

      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-icon">🤖</div>
        <div className="chat-header-text">
          <h1>RAG CHATBOT</h1>
          <p>Answers grounded in your documents</p>
        </div>
        <span className="online-dot" title="AI ready" />
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="icon">💬</div>
            <p>Ask anything about your documents</p>
            <span>Powered by your uploaded knowledge base</span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.role}`}>
            <div className={`avatar ${msg.role}`}>
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className={`bubble ${msg.role}`}>{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="msg-row bot">
            <div className="avatar bot">🤖</div>
            <div className="bubble bot">
              <div className="typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="input-wrap">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something about your documents…"
          />
        </div>
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={loading}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>

    </div>
  );
}