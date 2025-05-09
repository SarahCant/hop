"use client";

import { useEffect, useState } from "react";
import { get, ref, child, query, limitToLast } from "firebase/database";
import { database } from "./firebase";
import { useAuth } from "@/app/context/auth";
import ChatItem from "./components/ChatItem";
import RequireAuth  from "./components/RequireAuth";
import BottomMenu from "./components/BottomMenu";
import React from "react";

export default function ChatOverview() {
  const [chatList, setChatList] = useState([]); 
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (loading || !currentUser) return;

    //fetch array of chat IDs
    get(ref(database, `users/${currentUser.uid}/chats`))
      .then(snap => {
        const ids = snap.exists() ? Object.keys(snap.val()) : [];
        
        //lastMsg and createdAt for each chat
        return Promise.all(
          ids.map(async (chatId) => {
            const [createdSnap, lastMsgSnap] = await Promise.all([
              get(child(ref(database), `chats/${chatId}/createdAt`)),
              get(
                query(
                  ref(database, `chats/${chatId}/messages`),
                  limitToLast(1)
                )
              ),
            ]);

            const createdAt = createdSnap.exists() ? createdSnap.val() : 0;
            let lastTs = 0;
            lastMsgSnap.forEach(m => {
              const data = m.val();
              if (data.timestamp > lastTs) lastTs = data.timestamp;
            });

            //pick newest out of the two
            const timestamp = lastTs || createdAt;
            return { chatId, timestamp };
          })
        );
      })

      //sort descending and store in state
      .then(list => {
        list.sort((a, b) => b.timestamp - a.timestamp);
        setChatList(list);
      })
      .catch(err => {
        console.error("Failed to load/sort chats:", err);
        setChatList([]);
      });
  }, [currentUser, loading]);

  //loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <RequireAuth delay={700}>
      <div className="bg-[var(--blue)]/50 shadow-lg"> 
        <h1 className="text-center !pt-6 !pb-4 mb-3">SpilSammen Chats</h1>
      </div>
      <section>
        {chatList.map(({ chatId }, i) => (
          <React.Fragment key={chatId}>
            <ChatItem key={chatId} chatId={chatId} />

     
            {i < chatList.length - 1 && (
              <div className="bg-[var(--bg)] w-full">
                <hr className="w-[75%] mx-auto border-t border-gray-300 my-2" />
              </div>
            )}

          </React.Fragment>
          
        ))}
      </section>
      <BottomMenu />
    </RequireAuth>
  );
}
 