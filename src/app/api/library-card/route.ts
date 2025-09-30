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

    const libraryCard = await prisma.libraryCard.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            membershipDate: true,
          },
        },
      },
    });

    if (!libraryCard) {
      return NextResponse.json(
        { error: "Library card not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ libraryCard });
  } catch (error) {
    console.error("Error fetching library card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, maxBorrowLimit = 5 } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check if library card already exists
    const existingCard = await prisma.libraryCard.findUnique({
      where: { userId },
    });

    if (existingCard) {
      return NextResponse.json(
        { error: "Library card already exists for this user" },
        { status: 400 },
      );
    }

    // Generate unique card number
    const cardNumber = `LC${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Set expiry date to 1 year from now
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const libraryCard = await prisma.libraryCard.create({
      data: {
        userId,
        cardNumber,
        expiryDate,
        maxBorrowLimit,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            membershipDate: true,
          },
        },
      },
    });

    return NextResponse.json(libraryCard, { status: 201 });
  } catch (error) {
    console.error("Error creating library card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, maxBorrowLimit, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const libraryCard = await prisma.libraryCard.update({
      where: { userId },
      data: {
        maxBorrowLimit,
        isActive,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(libraryCard);
  } catch (error) {
    console.error("Error updating library card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
