"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../firebase";
import Link from "next/link";


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
    <div className=" bg-[var(--blue)]/50 h-screen pt-20">
      <div className="w-8/10 flex flex-col mx-auto p-8 bg-[var(--bg)] rounded-4xl">
        <h1 className="-mt-3">Log ind</h1>
        {errorMessage && <div>{errorMessage}</div>}
        <form onSubmit={onSubmit}>
          <section>
            <p>Din mail:</p>
            <input
              type="text"
              placeholder="e-mail@live.dk"
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
          
          </section>
          <section className="mt-8">
            <p>Din adgangskode:</p>
            <input
              type="password"
              placeholder="Adgangskode"
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
            />
          </section>
          <section className="mt-6 flex flex-col mx-auto">
            <button type="submit" className="cta mx-auto block">LOG IND</button>

            <div>
              <p>Ingen konto endnu?</p>
              <Link href="/register">
                <p className="underline">Opret dig her</p>
              </Link>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Login;