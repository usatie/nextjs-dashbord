import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

console.log(authConfig);
const nextAuth = NextAuth(authConfig);
console.log(nextAuth);
export default nextAuth.auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
};
