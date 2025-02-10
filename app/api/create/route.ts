import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { UserSession } from "@/types/Types";

export async function POST(request: NextRequest) {
  try {
    const response = new NextResponse();
    const session = await getIronSession<{ user?: UserSession }>(
      request,
      response,
      sessionOptions
    );

    if (!session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Both title and description are required." },
        { status: 400 }
      );
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      { message: "Todo added successfully!", newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the todo." },
      { status: 500 }
    );
  }
}
