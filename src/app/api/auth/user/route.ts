import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, name } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          name: name || null,
          role: "USER",
        },
      });
    } else if (user.name !== name && name) {
      user = await prisma.user.update({
        where: { firebaseUid },
        data: { name },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
