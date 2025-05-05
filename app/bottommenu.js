import Link from "next/link";
import { useAuth } from "./context/auth";
import { Fragment } from "react";
import { logout } from "./firebase";

export default function BottomMenu() {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return (
    <section>
      <Link href="/chats">Opret chat</Link>
        <Link href="/">Alle chats</Link>
        {currentUser === null && (
          <Fragment>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </Fragment>
        )}
     
        {currentUser && (
          <div>
            {/* {currentUser.username} */} <span onClick={() => logout()}>Logout</span>
          </div>
        )}

    </section>
  );
};
