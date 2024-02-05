import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import { SessionOptions } from 'next-auth';


const googleClientId = process.env.GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.log("missing google auth secrets in env");
  throw new Error("Google client ID or client secret is missing.");
}

const authOptions = {
 providers: [
  GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  }),
 ],

};
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}