"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { get, ref, query, limitToLast, child } from "firebase/database";
import { database } from "../firebase";
import UserIcon from "./UserIcon";
import TimeStamp from "./TimeStamp";

export default function ChatItem({ chatId }) {
  const [name, setName] = useState("");
  const [latestText, setLatestText] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      //fetch chat name
      const nameSnap = await get(child(ref(database), `chats/${chatId}/name`));
      setName(nameSnap.exists() ? nameSnap.val() : "Ukendt chat");

      //creation time
      const createdSnap = await get(
        child(ref(database), `chats/${chatId}/createdAt`)
      );
      const createdAt = createdSnap.exists() ? createdSnap.val() : 0;

      //latest message
      const lastMsgSnap = await get(
        query(ref(database, `chats/${chatId}/messages`), limitToLast(1))
      );
      let lastTxt = "";
      let lastTs = 0;
      let lastSender = "";
      lastMsgSnap.forEach((m) => {
        const v = m.val();
        lastTxt = v.text;
        lastTs = v.timestamp;
        lastSender = v.sender;
      });

      setLatestText(lastTxt);
      setTimestamp(lastTs || createdAt);

      //sender’s username
      if (lastSender) {
        const userSnap = await get(
          child(ref(database), `users/${lastSender}/username`)
        );
        setSenderName(userSnap.exists() ? userSnap.val() : lastSender);
      }
    })();
  }, [chatId]);

  return (
    <Link href={`/chat/${chatId}`}>
      <section className="block">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <UserIcon name={name} />
            <div className="flex flex-col ml-2 flex-1 min-w-0">
              <h2 className="truncate">{name}</h2>
              <p className="-mt-1 text-sm text-gray-600 truncate">
                {latestText
                  ? `${senderName} : ${latestText}`
                  : "Gruppe oprettet"}
              </p>
            </div>
          </div>

          <TimeStamp
            timestamp={timestamp}
            className="text-xs text-gray-500 whitespace-nowrap"
          />
        </div>
      </section>
    </Link>
  );
}
