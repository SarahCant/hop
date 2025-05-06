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
    //prevent adding self or duplicates
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

    //reset state
    setSelected([]);
    setGroupName("");

    //navigate to the new chat
    router.push(`/chat/${chatId}`);
  };

  return (
    <div>
      <section className="flex flex-col gap-8">
        {/* input group name */}
        <section className="flex flex-col pt-4">
          <label>Gruppenavn:</label>
          <input
            className="input"
            type="text"
            placeholder="Gruppenavn..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </section>

        {/* user search */}
        <UserSearch
          currentUser={currentUser}
          selectedUsers={selected}
          onAdd={addUser}
        />
      </section>

      {/* {selected.length > 0 && (
        <ul className="list-disc pl-5">
          {selected.map((u) => (
            <li key={u.uid} className="flex justify-between">
              {u.username}  ({u.email})
              <button onClick={() => removeUser(u.uid)}>
                X
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
      </button> */}

{     selected.length > 0 && (
        <ul className="divide-y divide-[var(--gray)]">
          {selected.map((u) => (
            <li key={u.uid} className="flex justify-between p-2">
              <div className="flex flex-col">
                <p className="leading-tight"> {u.username}</p>
                <p className="leading-snug"> {u.email}</p>
              </div>
              
              <button className="hover:text-[var(--red)] transition-colors" onClick={() => removeUser(u.uid)}>
                X
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        className="cta"
        disabled={!groupName || selected.length === 0}
        onClick={handleCreate}
      >
        OPRET CHAT
      </button>
    </div>
  );
}
