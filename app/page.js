"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, ref } from "firebase/database";
import { database } from "./firebase";
import { useAuth } from "@/app/context/auth";
import ChatItem from "./components/ChatItem";
import RequireAuth  from "./components/RequireAuth";
import BottomMenu from "./components/BottomMenu";

export default function ChatOverview() {
 
  const [chatIds, setChatIds] = useState([]);
  const router = useRouter();

const { currentUser, loading } = useAuth();

 /* import { useEffect, useState } from "react";
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
      const redirectTimeout = setTimeout(() => {
        router.push("/login");
      }, 700 );

      return () => clearTimeout(redirectTimeout);
    }
  }, [currentUser, loading, router]); */
  
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
        <div className="w-16 h-16 border-4 border-t-transparent border-[var(--green)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
  <RequireAuth delay={700}> 
      <h1 className="text-center">Alle chats</h1>

    
      <section className="max-w-md mx-auto divide-y">
        {chatIds.map(id => (
          <ChatItem key={id} chatId={id} />
        ))}
      </section>
       <BottomMenu />
   </RequireAuth>
  );
}
