import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { UserSession } from "@/types/Types";
import { sessionOptions } from "@/lib/session";
export async function PUT(req: NextRequest) {
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

    const { title, description } = await req.json();
    const id = req.nextUrl.pathname.split("/").pop();

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(
      { message: "Todo updated successfully!", updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo." },
      { status: 500 }
    );
  }
}
