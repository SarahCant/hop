"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../firebase";
import Link from "next/link";
import RedirectIfAuth from "../components/RedirectIfAuth";


export default function Login() {
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
      setErrorMessage("Der var et problem med log ind. Tjek dine input eller opret en ny konto.");
    }
  };

  return (
    <RedirectIfAuth>
      <div className="bg-[var(--cta)]/45 h-screen pt-20 ">
      <div className="w-8/10 flex flex-col mx-auto p-8 bg-[var(--bg)] rounded-4xl">
        <h1 className="-mt-3 mb-4 text-center">Log ind</h1>
 
        {/* input fields */}
        <form onSubmit={onSubmit}>
          <section>
            <label>Din mail:</label>
            <input
              type="text"
              placeholder="e-mail@live.dk"
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
          
          </section>
          <section className="mt-8">
            <label>Din adgangskode:</label>
            <input
              type="password"
              placeholder="Adgangskode"
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
            />
          </section>

          {/* error message */}
          <div className="h-6">
            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>
          
          {/* login CTA + no account? */}
          <section className="mt-8 flex flex-col mx-auto items-center text-center gap-y-6">
            <button type="submit" className="cta">LOG IND</button>

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
    </RedirectIfAuth>
  );
};
