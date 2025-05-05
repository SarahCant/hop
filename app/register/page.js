/* "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../firebase";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, username, password);
      router.push("/"); //if successful redirect to home page
    } catch (err) {
      setErrorMessage(err.code);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Register; */

"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, database, register } from "../firebase";

export  function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, username, password);
      //clear input fields
      setUsername("");
      setEmail("");
      setPassword("");
      router.push("/"); //if successful, redirect to home page
    } catch (err) {
      setErrorMessage(err.code);
    }
  };

  return (
    <div>
      <h1>Opret konto</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Register;