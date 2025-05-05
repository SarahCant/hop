"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../firebase";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/"); //if successful login redirect to home page
    } catch (err) {
      setErrorMessage(err.code);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={onSubmit}>
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
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
};

export default Login;