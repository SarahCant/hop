"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, ref } from "firebase/database";
import { database } from "./firebase";
import { useAuth } from "@/app/context/auth";
import ChatItem from "./components/ChatItem";

export default function ChatOverview() {
  const { currentUser, loading } = useAuth();
  const [chatIds, setChatIds] = useState([]);
  const router = useRouter();

  //redirect to login if not already
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  //load chats once authenticated
  useEffect(() => {
    if (loading || !currentUser) return;

    get(ref(database, `users/${currentUser.uid}/chats`))
      .then(snap => {
        if (snap.exists()) {
          setChatIds(Object.keys(snap.val()));
        } else {
          setChatIds([]);
        }
      })
      .catch(error => {
        console.error('Error fetching chats:', error);
        setChatIds([]);
      });
  }, [currentUser, loading]);

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1>Alle chats</h1>

    
      <section className="max-w-md mx-auto divide-y">
        {chatIds.map(id => (
          <ChatItem key={id} chatId={id} />
        ))}
      </section>
    </div>
  );
}
