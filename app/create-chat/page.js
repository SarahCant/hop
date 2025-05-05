"use client";

import ChatCreation from "../components/ChatCreation";
import { useAuth } from "../context/auth"; // Your auth context

const CreateChat = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Create a Group Chat</h1>
      <ChatCreation currentUser={currentUser} />
    </div>
  );
};

export default CreateChat;
