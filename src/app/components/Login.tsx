import { Avatar, Button } from "@chakra-ui/react";
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    SignIn,
    SignUp,
    RedirectToSignUp
  } from "@clerk/nextjs";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
// import { SignOutButton } from "./SignOutButton";
export default function Login() {

  const { user } = useUser();

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px 20px",
            width: "100%",
          }}
        >
            <SignedIn>
                <Link href={"/volunteerProfile"}>
                    <Avatar
                      src={user?.imageUrl}
                      size="md"
                    />
                </Link>
                {/* <SignOutButton/> */}
            </SignedIn>
            <SignedOut>
                {/* Signed out users get sign in button */}
                <SignInButton>
                    <Button>
                        Login
                    </Button>
                </SignInButton>
            </SignedOut>
        </div>
      </>
    );
  }
  