"use client"
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCard } from "./userCard";
import Google from "next-auth/providers/google";

export default function Login() {
    const { data: session } = useSession();
    console.log(session);
    if(session) { //if user logged in, show signout
        return (
          <>
            <button
              onClick={() => signOut()}
              type="button"
              className="btn btn-primary"
            >
              Sign Out of Google
            </button>
            <UserCard user={session?.user} />
          </>
        );
    } else { //if not logged in, sign in
        return (
            <>
                <button onClick={() => signIn('google')} type="button" className="btn btn-primary">Sign In with Google</button>
            </>
        )
    }
}