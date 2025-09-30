import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const where: { userId: string; bookId?: string } = { userId };

    if (bookId) {
      where.bookId = bookId;
    }

    const readingProgress = await prisma.readingProgress.findMany({
      where,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            pageCount: true,
          },
        },
      },
      orderBy: { lastReadDate: "desc" },
    });

    if (bookId) {
      // Return single book progress
      const progress = readingProgress[0] || null;
      return NextResponse.json({ progress });
    }

    return NextResponse.json({ readingProgress });
  } catch (error) {
    console.error("Error fetching reading progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      bookId,
      currentPage,
      totalPages,
      progressPercent,
      readingTime = 0,
      bookmarks,
      notes,
      isCompleted = false,
    } = body;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID and Book ID are required" },
        { status: 400 },
      );
    }

    const readingProgress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        currentPage: currentPage || 0,
        totalPages,
        progressPercent: progressPercent || 0,
        lastReadDate: new Date(),
        readingTime: {
          increment: readingTime,
        },
        bookmarks,
        notes,
        isCompleted,
      },
      create: {
        userId,
        bookId,
        currentPage: currentPage || 0,
        totalPages,
        progressPercent: progressPercent || 0,
        readingTime,
        bookmarks,
        notes,
        isCompleted,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    return NextResponse.json(readingProgress);
  } catch (error) {
    console.error("Error updating reading progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
