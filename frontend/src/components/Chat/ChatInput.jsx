import { useState } from "react";
import "./ChatInput.css";
import VoiceButton from "../Voice/VoiceButton";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  function handleSend() {
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
  }

  return (
    <div className="chat-input">

      <textarea
        value={text}
        rows={2}
        placeholder={
          isListening
            ? "🎤 Listening..."
            : "Ask Neko anything..."
        }
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {

          if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            handleSend();

          }

        }}
      />

      <div className="chat-actions">

        <VoiceButton

          onStart={() => setIsListening(true)}

          onEnd={() => setIsListening(false)}

          onResult={(speechText) => {

            setText(speechText);

          }}

        />

        <button
          className="send-btn"
          onClick={handleSend}
        >
          Send
        </button>

      </div>

    </div>
  );
}