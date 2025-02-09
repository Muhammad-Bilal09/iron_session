import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { IronSessionData } from "iron-session";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse("Email and password are required", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse("Invalid email or password", { status: 401 });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch) {
      return new NextResponse("Invalid email or password", { status: 401 });
    }

    // Create session
    const response = new NextResponse("Login successful", { status: 200 });
    const session = await getIronSession<IronSessionData>(
      request,
      response,
      sessionOptions
    );

    session.user = { id: user.id, email: user.email, name: user.name };
    await session.save();

    return response;
  } catch (error) {
    return new NextResponse("Login failed", { status: 500 });
  }
};
