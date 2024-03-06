"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCard } from "./userCard";
import { Button, ChakraProvider } from "@chakra-ui/react";
import Google from "next-auth/providers/google";

export default function Login() {
    const { data: session } = useSession();
    console.log(session);
    if(session) { //if user logged in, show signout
        return (
          <>
            <Button
              onClick={() => signOut()}
              colorScheme="yellow"
              size="lg"
            >
              Sign Out
            </Button>
            <UserCard user={session?.user} />
          </>
        );
    } else { //if not logged in, sign in
        return (
            <>
                <Button colorScheme="yellow" size = "lg" onClick={() => signIn('google')}>Sign Up</Button>
            </>
        )
    }
}