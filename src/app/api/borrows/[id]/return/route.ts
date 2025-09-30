import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: {
    id: string;
  };
}

export async function POST(_request: NextRequest, { params }: Context) {
  try {
    const { id } = params;

    const borrow = await prisma.borrow.update({
      where: { id },
      data: {
        status: "RETURNED",
        returnDate: new Date(),
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json(borrow);
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
