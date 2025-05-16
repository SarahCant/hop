"use client";
import Banner from "./components/Banner";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[var(--cta)]/45 h-screen content-center">
      <div className="absolute !-mt-[6rem] z-10  ">
        <Banner />
      </div>

      {/* info about missing page + links to alt places to check out */}
      <div className="!form-page w-8/10 flex flex-col mx-auto p-8 bg-[var(--bg)] rounded-4xl">
        <h1 className="leading-[2rem] text-center">Siden findes endnu ikke</h1>
        <p className="pt-2">
          Tak for din interesse! Siden findes desværre ikke endnu, men prøv
          hellere end gerne en af følgende i stedet:
        </p>
        <div className="flex  flex-col items-center gap-4 pt-[4vh] ">
          <button className="cta">
            <Link href="login">LOGIN</Link>
          </button>
          <button className="cta">
            <Link href="register">OPRET KONTO</Link>
          </button>
          <button className="cta">
            <Link href="/">ALLE CHATS</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
