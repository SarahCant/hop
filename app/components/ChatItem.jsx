/* "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { get, ref, query, limitToLast, child } from "firebase/database";
import { database } from "../firebase";

export default function ChatItem({ chatId }) {
  const [name, setName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [latestText, setLatestText] = useState("");
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      //chat name
      const nameSnap = await get(child(ref(database), `chats/${chatId}/name`));
      setName(nameSnap.exists() ? nameSnap.val() : "Ukendt chat");

      //createdAt
      const createdSnap = await get(child(ref(database), `chats/${chatId}/createdAt`));
      const createdAt = createdSnap.exists() ? createdSnap.val() : 0;

      //last message
      const lastMsgSnap = await get(
        query(ref(database, `chats/${chatId}/messages`), limitToLast(1))
      );
      let lastTs = 0, lastTxt = "";
      lastMsgSnap.forEach(m => {
        lastTxt = m.val().text;
        lastTs  = m.val().timestamp;
      });

      //choose timestamp
      setLatestText(lastTxt);
      setTimestamp(lastTs || createdAt);
    })();
  }, [chatId]);

  const timeString = timestamp
    ? new Date(timestamp).toLocaleString("da-DK", {
        dateStyle: "short",
        timeStyle: "short"
      })
    : "";

  return (
    <div className="p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span className="text-xs text-gray-500">{timeString}</span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {latestText || "Gruppe oprettet"}
      </p>
    </div>
  );
}

 */


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  get,
  ref,
  query,
  limitToLast,
  child,
} from "firebase/database";
import { database } from "../firebase";

export default function ChatItem({ chatId }) {
  const [name, setName] = useState("");
  const [latestText, setLatestText] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      // 1) chat name
      const nameSnap = await get(child(ref(database), `chats/${chatId}/name`));
      setName(nameSnap.exists() ? nameSnap.val() : "Ukendt chat");

      // 2) creation time
      const createdSnap = await get(child(ref(database), `chats/${chatId}/createdAt`));
      const createdAt = createdSnap.exists() ? createdSnap.val() : 0;

      // 3) last message
      const lastMsgSnap = await get(
        query(ref(database, `chats/${chatId}/messages`), limitToLast(1))
      );
      let lastTxt = "";
      let lastTs = 0;
      let lastSender = "";
      lastMsgSnap.forEach(m => {
        const v = m.val();
        lastTxt = v.text;
        lastTs  = v.timestamp;
        lastSender = v.sender;
      });

      setLatestText(lastTxt);
      setTimestamp(lastTs || createdAt);

      // 4) fetch sender’s username
      if (lastSender) {
        const userSnap = await get(child(ref(database), `users/${lastSender}/username`));
        setSenderName(userSnap.exists() ? userSnap.val() : lastSender);
      }
    })();
  }, [chatId]);

  const timeString = timestamp
    ? new Date(timestamp).toLocaleString("da-DK", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "";

  return (
    <Link href={`/chat/${chatId}`}>
    
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <span className="text-xs text-gray-500">{timeString}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {latestText
            ? `${senderName}: ${latestText}`
            : "Gruppe oprettet"}
        </p>
      
    </Link>
  );
}
