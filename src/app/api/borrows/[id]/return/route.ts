import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const borrow = await prisma.borrow.update({
      where: { id: params.id },
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
