import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { UserSession } from "@/types/Types";

export const POST = async (request: NextRequest) => {
  const response = new NextResponse();
  const session = await getIronSession<{ user?: UserSession }>(
    request,
    response,
    sessionOptions
  );

  if (!session.user) {
    return NextResponse.json(
      { message: "No active session to logout" },
      { status: 401 }
    );
  }

  session.destroy();
  await session.save();

  const logoutResponse = new NextResponse(
    JSON.stringify({ message: "Logged out successfully" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${sessionOptions.cookieName}=; Path=/; HttpOnly; Max-Age=0;`,
      },
    }
  );

  return logoutResponse;
};
