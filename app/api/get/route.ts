import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { UserSession } from "@/types/Types";
import { sessionOptions } from "@/lib/session";
export async function GET(req: NextRequest) {
  try {
    const response = new NextResponse();
    const session = await getIronSession<{ user?: UserSession }>(
      req,
      response,
      sessionOptions
    );

    if (!session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos." },
      { status: 500 }
    );
  }
}
