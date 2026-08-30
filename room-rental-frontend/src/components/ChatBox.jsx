import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ChatBox({ roomId, otherUserId, otherUserName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = () => {
    api.get(`/messages/${roomId}/${otherUserId}`)
      .then((res) => setMessages(res.data.messages))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [roomId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post("/messages", { roomId, text });
      setText("");
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 border rounded-xl bg-gray-50 flex flex-col h-72">
      <div className="px-3 py-2 border-b bg-white rounded-t-xl">
        <p className="text-sm font-semibold text-gray-900">Chat with {otherUserName}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-4">No messages yet. Say hi!</p>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                String(m.sender) === String(user.id) || String(m.sender?._id) === String(user.id)
                  ? "bg-teal-800 text-white self-end"
                  : "bg-white border text-gray-800 self-start"
              }`}
            >
              {m.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex border-t p-2 gap-2 bg-white rounded-b-xl">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-teal-800 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;