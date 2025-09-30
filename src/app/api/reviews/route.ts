import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const where: {
      isPublic: boolean;
      bookId?: string;
      OR?: Array<{
        userId?: string;
        isPublic?: boolean;
      }>;
    } = { isPublic: true };

    if (bookId) {
      where.bookId = bookId;
    }

    if (userId) {
      where.OR = [{ userId }, { isPublic: true }];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bookId, rating, title, content, isPublic = true } = body;

    if (!userId || !bookId || !rating) {
      return NextResponse.json(
        { error: "User ID, Book ID, and rating are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if user already reviewed this book
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this book" },
        { status: 400 },
      );
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating,
        title,
        content,
        isPublic,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    // Update book's average rating
    const bookStats = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        averageRating: bookStats._avg.rating || 0,
        ratingsCount: bookStats._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
