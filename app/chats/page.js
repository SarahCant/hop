//overview of user's group chats
"use client";

import UserSearch from "../components/UserSearch";
import ChatCreation from "../components/ChatCreation";
import { useAuth } from "../context/auth"; // Your auth context

const ChatsPage = () => {
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

export default ChatsPage;
