/* "use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ref, onChildAdded, query, orderByChild, off } from "firebase/database";
import { database, sendMessage } from "../../firebase";
import { useAuth } from "@/app/context/auth";


export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!chatId) return;

     //clear previous messages
  setMessages([]);

  const msgsRef = ref(database, `chats/${chatId}/messages`);
  const msgsQuery = query(msgsRef, orderByChild("timestamp"));

  //define a named callback so we can clean it up
  const onAdd = (snap) => {
    setMessages((prev) => [...prev, { id: snap.key, ...snap.val() }]);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  onChildAdded(msgsQuery, onAdd);

  //cleanup exactly that callback
  return () => off(msgsRef, "child_added", onAdd);
}, [chatId]);

  const handleSend = async () => {
    if (!draft.trim() || !chatId) return;
    await sendMessage(chatId, currentUser.uid, draft);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto px-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded ${
              m.sender === currentUser.uid
                ? "bg-blue-200 self-end"
                : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={listRef} />
      </div>

      <div className="p-4 border-t flex">
        <input
          type="text"
          className="flex-1 border rounded p-2 mr-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
 */

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ref, onChildAdded, query, orderByChild, off } from "firebase/database";
import { database, sendMessage } from "../../firebase";
import { useAuth } from "@/app/context/auth";


export default function ChatRoom() {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef();

  useEffect(() => {
    if (!chatId) return;

    setMessages([]);
    const msgsRef = ref(database, `chats/${chatId}/messages`);
    const msgsQuery = query(msgsRef, orderByChild("timestamp"));

    const onAdd = snap => {
      setMessages(prev => [...prev, { id: snap.key, ...snap.val() }]);
      listRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    onChildAdded(msgsQuery, onAdd);
    return () => off(msgsRef, "child_added", onAdd);
  }, [chatId]);

  const handleSend = async () => {
    if (!draft.trim() || !chatId || !currentUser) return;
    await sendMessage(chatId, currentUser.uid, draft);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4">
        {messages.map(m => {
          const isMe = m.sender === currentUser?.uid;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  (isMe
                    ? "bg-blue-500 text-white rounded-tl-lg rounded-bl-lg rounded-tr-lg"
                    : "bg-gray-200 text-gray-800 rounded-tr-lg rounded-br-lg rounded-tl-lg"
                  ) +
                  " px-4 py-2 max-w-xs break-words"
                }
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={listRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring"
          placeholder="Skriv besked..."
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}
