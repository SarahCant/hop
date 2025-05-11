"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";

export default function ChatName({ className = "" }) {
  const { chatId } = useParams();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!chatId) return;

    const fetchName = async () => {
      try {
        const nameSnapshot = await get(
          child(ref(database), `chats/${chatId}/name`)
        );
        if (nameSnapshot.exists()) {
          setName(nameSnapshot.val());
        } else {
          setName("Ukendt chat");
        }
      } catch (err) {
        console.error("Fejl ved hentning af chatnavn:", err);
        setName("Fejl");
      }
    };

    fetchName();
  }, [chatId]);

  return <div className={className}>{name}</div>;
}
