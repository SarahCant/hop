//search users by email
"use client";

import { useState, useEffect } from "react";
import { findUserByEmail } from "../firebase";
import { searchUsersByEmailPrefix } from "../firebase";

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
      <div className="space-y-1">
        <input
          className="border rounded p-2 w-full"
          type="text"
          placeholder="Søg efter mail..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
  
        {loading && <div>Loading…</div>}
  
        {!loading && suggestions.length > 0 && (
          <ul className="border rounded shadow-sm max-h-40 overflow-auto">
            {suggestions.map((user) => (
              <li
                key={user.uid}
                className="flex justify-between items-center px-2 py-1 hover:bg-gray-100"
              >
                <span>
                  {user.username} ({user.email})
                </span>
                <button
                  className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    onAdd(user);
                    setTerm("");
                    setSuggestions([]);
                  }}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }