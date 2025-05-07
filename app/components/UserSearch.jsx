//search users by email
"use client";

import { useState, useEffect } from "react";
import { findUserByEmail } from "../firebase";
import { searchUsersByEmailPrefix } from "../firebase";
import React from "react";

/* const UserSearch = ({ onUserFound }) => {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    const user = await findUserByEmail(email.toLowerCase());
    setSearchResult(user);
    if (user && onUserFound) {
      onUserFound(user);
    };

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Invalid email format");
        return;
      }
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Enter user's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResult && (
        <div>
          Found: {searchResult.username} ({searchResult.email})
        </div>
      )}
    </div>
  );
};

export default UserSearch;
 */

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
      <input
        className="input w-full"
        type="text"
        placeholder="Søg efter brugermails"
        value={term}
        onChange={e => setTerm(e.target.value)}
      />

      {loading && (
        <div className="absolute top-full left-0 mt-1 bg-white p-2">
          Indlæser…
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <ul
          className="
            absolute top-full left-0 w-full mt-1
            bg-[var(--gray)] rounded shadow-lg z-10
            max-h-60 overflow-y-auto
          "
        >
          {suggestions.map((user, idx) => (
            <li
              key={user.uid}
              className="flex justify-between items-center px-3 py-2 hover:bg-gray-200"
            >
              <div>
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
          ))}
        </ul>
      )}
    </div>
      

    


    );
  }