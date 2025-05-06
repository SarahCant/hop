import Link from "next/link";
import { useAuth } from "./context/auth";
import { Fragment } from "react";
import { logout } from "./firebase";

export default function BottomMenu() {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return (
    <section className="absolute inset-x-0 bottom-10 pl-12">
      <Link href="/create-chat">Opret chat</Link>
        <Link href="/">Alle chats</Link>
        {currentUser === null && (
          <Fragment>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </Fragment>
        )}
     
        {currentUser && (
          <div>
            {/* {currentUser.username} */} <span onClick={() => logout()}>
              <Link href="/login">Log ud</Link>
              </span>
          </div>
        )}

    </section>
  );
};
