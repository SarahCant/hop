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
    //render nothing if no chatId
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

      //last message's sender
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
      <div className="block">
        <section className="flex justify-between p-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* chat's icon */}
            <UserIcon name={name} />
            <div className="flex flex-col ml-2 flex-1 min-w-0">
              {/* chat name */}
              <h3 className="truncate">{name}</h3>
              <p className="-mt-[0.3rem] !text-xs !text-gray-600 truncate">
                {/* latest message and it's sender : group created */}
                {latestText
                  ? `${senderName} : ${latestText}`
                  : "Gruppe oprettet"}
              </p>
            </div>
          </div>

          {/* latest message or creation timestamp */}
          <TimeStamp
            timestamp={timestamp}
            className="text-xs text-gray-500 whitespace-nowrap pt-[0.1vw] "
          />
        </section>
      </div>
    </Link>
  );
}
