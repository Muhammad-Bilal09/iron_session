import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { UserSession } from "@/types/Types";

export const GET = async (request: NextRequest) => {
  const response = new NextResponse();
  const session = await getIronSession<{ user?: UserSession }>(
    request,
    response,
    sessionOptions
  );

  if (!session.user) {
    return NextResponse.json({ message: "No active session" }, { status: 401 });
  }

  return NextResponse.json({ user: session.user }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const response = new NextResponse();
  const { id, email, name } = await request.json();
  const session = await getIronSession<{ user?: UserSession }>(
    request,
    response,
    sessionOptions
  );

  session.user = { id, email, name };
  await session.save();

  return NextResponse.json(
    { message: "Session created", user: session.user },
    { status: 200 }
  );
};
