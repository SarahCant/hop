"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroupChat } from "../firebase";
import UserSearch from "./UserSearch";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequireAuth from "./RequireAuth";
import Banner from "./Banner";

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

  //remove selected
  const removeUser = (uid) => {
    setSelected((prev) => prev.filter((u) => u.uid !== uid));
  };

  //only create if there's a group name and selected users
  const handleCreate = async () => {
    if (!groupName || selected.length === 0) return;
    const chatId = await createGroupChat(currentUser, selected, groupName);

    //reset state/clear fields
    setSelected([]);
    setGroupName("");

    //navigate to chatroom
    router.push(`/chat/${chatId}`);
  };

  return (
    <RequireAuth delay={700}>
      {/* check for currentUser */}
      <section className="flex flex-col gap-12 w-80 mx-auto mt-8">
        {/* group name input */}
        <section className="flex flex-col pt-2">
          {/* change bg of input field */}
          <input
            className={`input w-full ${
              groupName === ""
                ? "!bg-[var(--blue)]/40"
                : "!bg-[var(--green)]/20"
            } focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)]`}
            type="text"
            placeholder="Gruppenavn"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            maxLength="20"
            required
          />
          {/* max-length UI */}
          <p className="!text-xs text-right pr-2 !text-gray-400 pt-1">
            {groupName.length}/20
          </p>
        </section>

        {/* chat banner displaying groupName input */}
        <div className="relative self-center -top-6.5 -mb-3">
          <Banner name={groupName ? groupName : " "} />
        </div>

        {/* user search */}
        <UserSearch
          currentUser={currentUser}
          selectedUsers={selected}
          onAdd={addUser}
        />
      </section>

      {/* selected members */}
      <h2 className="pt-20">Din gruppe</h2>
      {selected.length > 0 ? (
        <ul>
          <AnimatePresence>
            {selected.map((u, i) => (
              <React.Fragment key={u.uid}>
                <motion.li
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex justify-between w-80 mx-auto p-2 bg-[var(--blue)]/40 "
                >
                  {/* selected's info */}
                  <div className="flex flex-col">
                    <p className="">{u.username}</p>
                    <p className="!text-[11px] text-gray-600 -mt-1">
                      {u.email}
                    </p>
                  </div>

                  {/* remove btn */}
                  <button onClick={() => removeUser(u.uid)}> X </button>
                </motion.li>

                {/* divider */}
                {i < selected.length - 1 && (
                  <div className="bg-[var(--blue)]/40 w-full">
                    <hr className="w-[80%] mx-auto border-t border-gray-400 " />
                  </div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        /* alt text if no selected yet */
        <p className="text-gray-500 italic pt-2">
          Du har ikke tilføjet nogle medlemmer endnu.
        </p>
      )}
      {/* "create" btn */}
      <div className="w-fit h-fit rounded-4xl bg-[var(--bg)] fixed bottom-25 right-4 ">
        <button
          onClick={handleCreate}
          /* disable if no group name or members */
          disabled={!groupName || selected.length === 0}
          className={`cta !w-fit !text-[1.1rem] ${
            groupName && selected.length > 0
              ? "opacity-100"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          OPRET
        </button>{" "}
      </div>
    </RequireAuth>
  );
}
