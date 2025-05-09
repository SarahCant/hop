"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  ref,
  onChildAdded,
  query,
  orderByChild,
  off,
  get,
} from "firebase/database";
import { database, sendMessage } from "../../firebase";
import { useAuth } from "@/app/context/auth";
import ChatName from "@/app/components/ChatName";
import UserIcon from "@/app/components/UserIcon";
import Link from "next/link";

export default function ChatRoom() {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    setMessages([]);
    const msgsRef = ref(database, `chats/${chatId}/messages`);
    const msgsQuery = query(msgsRef, orderByChild("timestamp"));

    const onAdd = (snap) => {
      const data = snap.val();

      // fetch the user node, then process it in .then()
      get(ref(database, `users/${data.sender}`))
        .then((userSnap) => {
          /* 
          console.log(
            "Fetched user node for",
            data.sender,
            "→",
            userSnap.exists() ? userSnap.val() : null
          ); */

          const senderName = userSnap.exists()
            ? (userSnap.val().username || userSnap.val().name || "Ukendt")
            : "Ukendt";

          setMessages((prev) => [
            ...prev,
            { id: snap.key, ...data, senderName },
          ]);
          listRef.current?.scrollIntoView({ behavior: "smooth" });
        })
        .catch((err) => {
          console.error("Error fetching user", data.sender, err);
          // still add the message, just with a fallback name
          setMessages((prev) => [
            ...prev,
            { id: snap.key, ...data, senderName: "Ukendt" },
          ]);
          listRef.current?.scrollIntoView({ behavior: "smooth" });
        });
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
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--blue)] shadow-lg ">
        <Link href="/"> 
          <h2 className="!text-xl">&lt;</h2>
        </Link>
        <ChatName className="text-center" />
        <div className="w-1"/>
      </header>



      {/* messages */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-6">
        {messages.map((m) => {
          const isMe = m.sender === currentUser?.uid;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-xs break-words ${
                  isMe
                    ? "bg-[var(--green)] text-[var(--bg)] rounded-tl-xl rounded-bl-xl rounded-tr-xl right-2.5"
                    : "bg-[var(--gray)] text-[var(--black)] rounded-xl left-4.5"
                } px-4 py-2`}
              >
                {m.text}

                {!isMe && (
                  <div className="absolute -bottom-0.5 -left-3.5 -mb-1 -ml-3.5">
                    <UserIcon name={m.senderName} className="uicon !w-6 !h-6"/>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={listRef} />
      </div>

      {/* msg bar */}
      <div className="p-4 border-t border-[var(--green)] flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 rounded-full px-4 py-2 focus:outline-none focus:ring input"
          placeholder="Skriv besked..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-[var(--green)] text-[var(--bg)] font-medium rounded-full px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}
