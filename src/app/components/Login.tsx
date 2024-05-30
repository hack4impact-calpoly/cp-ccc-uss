import { Button } from "@chakra-ui/react";
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
import { Avatar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { SignOutButton } from "./SignOutButton";
export default function Login() {

  const user = useUser();
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
    },
  });
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
                  <ThemeProvider theme={theme}>
                    <Avatar
                      src={user.user?.imageUrl}
                    />
                  </ThemeProvider>
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
  