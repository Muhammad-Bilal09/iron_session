import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "./types/Types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session: IronSession<SessionData> = await getIronSession<SessionData>(
    req,
    res,
    sessionOptions
  );
  if (!session.user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}
export const config = {
  matcher: ["/"],
};
