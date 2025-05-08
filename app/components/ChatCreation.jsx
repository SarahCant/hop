"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroupChat } from "../firebase";
import UserSearch from "./UserSearch";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequireAuth from "./RequireAuth";

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
    <RequireAuth delay={700} >
      <section className="flex flex-col gap-13 w-80 mx-auto mt-8">
        {/* input group name */}
        <section className="flex flex-col pt-4">
          <input
            className="input w-full !bg-[var(--blue)]/20"
            type="text"
            placeholder="Indtast gruppenavn"
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

      {/* selected members */}
      <h2 className="pt-20" >Din gruppe</h2>
      {selected.length > 0 ? (
       
        <ul>
  <AnimatePresence>
    {selected.map((u, i) => (
      <React.Fragment key={u.uid}>
   
        <motion.li
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="flex justify-between w-80 mx-auto p-2 bg-[var(--blue)]/20 rounded"
        >
          <div className="flex flex-col">
            <p className="">{u.username}</p>
            <p className="!text-[11px] text-gray-600 -mt-1">{u.email}</p>
          </div>
          <button onClick={() => removeUser(u.uid)}> X </button>
        </motion.li>

        {/* border between the selected users */}
        {i < selected.length - 1 && (
          <div className="bg-[var(--blue)]/30 w-full"> 
            <hr className="w-[80%] mx-auto border-t border-gray-400 " /> 
          </div>
        )}
      </React.Fragment>
    ))}
  </AnimatePresence>
</ul>

      ) : (
        <p className="text-gray-500 italic pt-2">Du har ikke tilføjet nogle medlemmer endnu.</p>
      )}

      {/* "create" btn */}
      <button
        className="cta !bg-[var(--green)] fixed bottom-50 right-4"
        disabled={!groupName || selected.length === 0}
        onClick={handleCreate}
      >
        OPRET
      </button>
    </RequireAuth>
  );
}
