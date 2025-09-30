import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const borrows = await prisma.borrow.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: { borrowDate: "desc" },
    });

    return NextResponse.json(borrows);
  } catch (error) {
    console.error("Error fetching borrows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, bookId } = await request.json();

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if book is already borrowed by this user and not returned
    const existingBorrow = await prisma.borrow.findFirst({
      where: {
        userId,
        bookId,
        status: "BORROWED",
      },
    });

    if (existingBorrow) {
      return NextResponse.json(
        { error: "Book is already borrowed by this user" },
        { status: 400 },
      );
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
        status: "BORROWED",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json(borrow);
  } catch (error) {
    console.error("Error creating borrow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
