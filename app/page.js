"use client";

import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "./firebase";
import { useAuth } from "@/app/context/auth";
import ChatItem from "./components/ChatItem";

export default function ChatOverview() {
  const { currentUser, loading } = useAuth();
  const [chatIds, setChatIds] = useState([]);

  useEffect(() => {
    if (loading || !currentUser) return;
    get(ref(database, `users/${currentUser.uid}/chats`))
      .then(snap => {
        if (snap.exists()) {
          setChatIds(Object.keys(snap.val()));
        } else {
          setChatIds([]);
        }
      });
  }, [currentUser, loading]);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="max-w-md mx-auto divide-y">
      {chatIds.map(id => (
        <ChatItem key={id} chatId={id} />
      ))}
    </div>
  );
}
