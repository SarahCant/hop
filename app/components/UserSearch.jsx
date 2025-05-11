"use client";

import { useState, useEffect } from "react";
import { searchUsersByEmailPrefix } from "../firebase";
import React from "react";

export default function UserSearch({ currentUser, selectedUsers, onAdd }) {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch suggestions whenever `term` changes
  useEffect(() => {
    let isCanceled = false;
    async function fetch() {
      if (!term) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const matches = await searchUsersByEmailPrefix(term.toLowerCase());
      if (isCanceled) return;
      // filter out self and already‐selected
      setSuggestions(
        matches.filter(
          (u) =>
            u.uid !== currentUser.uid &&
            !selectedUsers.some((sel) => sel.uid === u.uid)
        )
      );
      setLoading(false);
    }
    fetch();
    return () => {
      isCanceled = true;
    };
  }, [term, currentUser.uid, selectedUsers]);

  return (
    <div className="relative w-full">
      {/* search input field */}
      <input
        type="text"
        placeholder="Søg efter brugermails"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className={`input w-full  ${
          term === "" ? "!bg-[var(--green)]/40" : "!bg-[var(--green)]/20"
        } focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)]`}
      />

      {!loading && suggestions.length > 0 && (
        <ul
          className="
            absolute top-full  w-75 left-1 mt-1
            bg-[var(--bg)] rounded shadow-lg z-10
            max-h-60 overflow-y-auto
          "
        >
          <div className="bg-[var(--blue)]/20">
            {suggestions.map((user, i) => (
              <React.Fragment>
                <li
                  key={user.uid}
                  className="flex justify-between items-center px-3 py-2"
                >
                  <div className="flex-col">
                    <p className="text-sm">{user.username}</p>
                    <p className="text-xs text-gray-500 -mt-1">{user.email}</p>
                  </div>
                  <button
                    className="cta text-xs"
                    onClick={() => {
                      onAdd(user);
                      setTerm("");
                      setSuggestions([]);
                    }}
                  >
                    TILFØJ
                  </button>
                </li>

                {i < suggestions.length - 1 && (
                  <div className="bg-[var(--gray)] w-full">
                    <hr className="w-[80%] mx-auto border-t border-gray-300 my-0.5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}
