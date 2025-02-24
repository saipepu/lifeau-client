import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log("Checking if user is authenticated...", token);
  // If user is NOT authenticated, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/landing", req.url)); // Change to your login route
  }

  return NextResponse.next(); // Allow request if authenticated
}

// Protect specific routes (e.g., dashboard, profile, settings)
export const config = {
  matcher: ["/dashboard/:path*"],
};