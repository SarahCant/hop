"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../firebase";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTos, setAgreeTos] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    //error validating
    if (!username || !email || !password) {
      setErrorMessage("Alle felter skal udfyldes før, du kan fortsætte.");
      return;
    }

    if (!agreeTos) {
      setErrorMessage("Du skal acceptere betingelserne for at kunne oprette en konto.");
      return;
    }

    try {
      await register(email, username, password);
      setUsername("");
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      let msg = "Der var et problem med at oprette kontoen.";
      switch (err.code) {
        case "auth/invalid-email":
          msg = "E-mail-adressen er ikke gyldig.";
          break;
        case "auth/email-already-in-use":
          msg = "Denne e-mail er allerede i brug.";
          break;
        case "auth/weak-password":
          msg = "Adgangskoden er for svag (mindst 6 tegn).";
          break;
        default:
          msg += " Prøv venligst igen eller log ind nedenfor.";
      }
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-[var(--blue)]/25 h-screen pt-20">
      <div className="w-8/10 flex flex-col mx-auto p-8 bg-[var(--bg)] rounded-4xl">
        <h1 className="-mt-3 mb-4">Opret konto</h1>

        {/* input fields */}
        <form onSubmit={onSubmit}>
          <section>
            <label>Dit navn:</label>
            <input
              type="text"
              placeholder="Navn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full"
            />
          </section>

          <section className="mt-8">
            <label>Din e-mail:</label>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
          </section>

          <section className="mt-8">
            <label>Din adgangskode:</label>
            <input
              type="password"
              placeholder="Adgangskode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
            />
          </section>      

          {/* t&c*/}
          <div className="flex mt-4 gap-0.5">
            <input
              id="tos"
              type="checkbox"
              checked={agreeTos}
              onChange={() => setAgreeTos(!agreeTos)}
            />
            <label htmlFor="tos" className="text-sm">
              Jeg accepterer{" "}
              <Link href="/terms" className="underline text-[var(--blue)]">
                vilkår og betingelser
              </Link>
            </label>
          </div>

          {/* error message */}
          <div className="h-6">
            {errorMessage && <p className="error">{errorMessage}</p>}  
          </div>

          {/* register CTA + already have an account? */}
          <section className="mt-8 flex flex-col mx-auto items-center text-center gap-y-6">
            <button type="submit" className="cta">OPRET KONTO</button>

            <div className="text-center text-sm">
              <p>Har du allerede en konto?</p>
              <Link href="/login">
                <p className="underline">Log ind her</p>
              </Link>
            </div> 
          </section>
        </form>
      </div>
    </div>
  );
}

