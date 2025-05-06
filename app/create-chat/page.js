"use client";

import ChatCreation from "../components/ChatCreation";
import { useAuth } from "../context/auth";

export default function CreateChat() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Indlæser...</div>;
  }

  return (
    <div className="flex flex-col w-90 mx-auto">
      <h1 className="mt-5">Opret gruppe</h1>
      <p>Her kan du oprette chats. Du kan søge efter dine venner ved at intaste deres e-mails. Husk også at vælge et fedt navn!</p>
      <ChatCreation currentUser={currentUser} />
    </div>
  );
};


