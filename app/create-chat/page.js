"use client";

import ChatCreation from "../components/ChatCreation";
import { useAuth } from "../context/auth";

export default function CreateChat() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Indlæser...</div>;
  }

  return (
    <div className="flex flex-col w-80 mx-auto">
      <h1 className="mt-6 m">Opret gruppe</h1>
      <p>Her kan du oprette chats. Du kan tilføje medlemmer ved at søge efter deres e-mails. Husk også at vælge et fedt gruppenavn! Når du er færdig, kan du trykke på &quot;Opret&quot;.</p>
      <ChatCreation currentUser={currentUser} />
    </div>
  );
};


