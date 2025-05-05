"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroupChat } from "../firebase";
import UserSearch from "./UserSearch";

export default function ChatCreation({ currentUser }) {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");

  const addUser = (user) => {
    // Prevent adding self or duplicates
    if (
      user.uid === currentUser.uid ||
      selected.some((u) => u.uid === user.uid)
    )
      return;
    setSelected((prev) => [...prev, user]);
  };

  const removeUser = (uid) => {
    setSelected((prev) => prev.filter((u) => u.uid !== uid));
  };

  const handleCreate = async () => {
    if (!groupName || selected.length === 0) return;
    const chatId = await createGroupChat(
      currentUser,
      selected,
      groupName
    );

    // Reset state
    setSelected([]);
    setGroupName("");

    // Navigate to the new chat
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <input
        className="border p-2 rounded w-full"
        type="text"
        placeholder="Gruppenavn*"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        required
      />

      <UserSearch
        currentUser={currentUser}
        selectedUsers={selected}
        onAdd={addUser}
      />

      {selected.length > 0 && (
        <ul className="list-disc pl-5">
          {selected.map((u) => (
            <li key={u.uid} className="flex justify-between">
              {u.username} ({u.email})
              <button
                className="text-red-600 ml-2"
                onClick={() => removeUser(u.uid)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!groupName || selected.length === 0}
        onClick={handleCreate}
      >
        Create Chat
      </button>
    </div>
  );
}
