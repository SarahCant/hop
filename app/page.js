/* "use client";

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
 */

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

            {/* dividing border */}
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
