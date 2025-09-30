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

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            bookAuthors: {
              include: {
                author: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: [{ priority: "desc" }, { addedDate: "desc" }],
    });

    return NextResponse.json({ wishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bookId, priority = 0, notes } = body;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 },
      );
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Book is already in your wishlist" },
        { status: 400 },
      );
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        bookId,
        priority,
        notes,
      },
      include: {
        book: {
          include: {
            bookAuthors: {
              include: {
                author: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 },
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return NextResponse.json({ message: "Book removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
