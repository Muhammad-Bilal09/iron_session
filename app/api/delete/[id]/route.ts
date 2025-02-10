import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { UserSession } from "@/types/Types";
export async function DELETE(req: NextRequest) {
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

    const id = req.nextUrl.pathname.split("/").pop();

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo." },
      { status: 500 }
    );
  }
}
