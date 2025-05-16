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
import TimeStamp from "@/app/components/TimeStamp";
import Banner from "@/app/components/Banner";
import Image from "next/image";

export default function ChatRoom() {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const endRef = useRef(null);

  //useRef to start at chat bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    setMessages([]);
    const msgsRef = ref(database, `chats/${chatId}/messages`);
    const msgsQuery = query(msgsRef, orderByChild("timestamp"));

    const onAdd = (snap) => {
      const data = snap.val();

      //fetch sender
      get(ref(database, `users/${data.sender}`))
        .then((userSnap) => {
          const senderName = userSnap.exists()
            ? userSnap.val().username || userSnap.val().name || "Ukendt"
            : "Ukendt";

          setMessages((prev) => [
            ...prev,
            { id: snap.key, ...data, senderName },
          ]);
          listRef.current?.scrollIntoView({ behavior: "smooth" });
        })
        .catch((err) => {
          console.error("Error fetching user", data.sender, err);
          //if err still add message just with a fallback name
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

  //don't send if no message, no chatId or no currentUser
  const handleSend = async () => {
    if (!draft.trim() || !chatId || !currentUser) return;
    await sendMessage(chatId, currentUser.uid, draft);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* header w/ banner */}
      <header className="shadow-lg ">
        <Link href="/" className="absolute top-[0.7rem] left-[0.2rem]">
          {/* back btn */}
          <Image
            src="./img/icons/back-green.png"
            width={15}
            height={15}
            alt="Tilbage"
            className="!ml-[0.2rem]"
          />
          <p className="!text-[10px] -mt-1 !text-[var(--green)]">Chats</p>
        </Link>

        {/* banner */}
        <Banner>
          <ChatName />
        </Banner>
      </header>

      {/* actual chat */}
      {/* check for current user and different msg styling if so */}
      <section className="flex-1 overflow-auto px-4 py-2 space-y-9">
        {messages.map((m) => {
          const isMe = m.sender === currentUser?.uid;
          return (
            <>
              {/* timestamps */}
              <div className="flex justify-center mb-2 items-center gap-2 ">
                <div className="w-[25%] border-b border-[var(--gray)]" />
                <TimeStamp
                  timestamp={m.timestamp}
                  className="text-xs text-gray-400 whitespace-nowrap"
                />
                <div className="w-[25%] border-b border-[var(--gray)]" />
              </div>

              <div
                key={m.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative break-words max-w-[70%] ${
                    isMe
                      ? "bg-[var(--green)] text-[var(--bg)] rounded-tl-4xl rounded-bl-4xl rounded-tr-4xl right-2.5"
                      : "bg-[var(--gray)] text-[var(--black)] rounded-tl-4xl rounded-tr-4xl rounded-br-4xl left-4.5"
                  } px-4 py-3`}
                >
                  {m.text}

                  {/* UserIcon if not current user */}
                  {!isMe && (
                    <div className="absolute -bottom-1 -left-3.5 -mb-1 -ml-3.5">
                      <UserIcon
                        name={m.senderName}
                        className="uicon !w-6 !h-6"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })}

        {/* useRef endRef to start at chat bottom */}
        <div ref={endRef} />
      </section>

      {/* text input field */}
      <div className="p-4 border-t border-[var(--green)] flex items-center space-x-2">
        <input
          type="text"
          className="input flex-1 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)]"
          placeholder="Skriv besked..."
          /* input value = draft */
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          /* clik on enter calls handleSend */
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* send btn */}
        <button
          onClick={handleSend}
          className="cta !bg-[var(--green)] !w-fit !px-[1.4rem]"
        >
          <Image
            src="./img/icons/send-btn.png"
            width={25}
            height={25}
            alt="Send besked"
          />
        </button>
      </div>
    </div>
  );
}
