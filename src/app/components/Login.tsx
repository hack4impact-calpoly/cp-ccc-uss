import { Button } from "@chakra-ui/react";
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  } from "@clerk/nextjs";

export default function Login() {
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
                {/* Mount the UserButton component */}
                <UserButton />
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
  