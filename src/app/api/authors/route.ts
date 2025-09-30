import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        include: {
          bookAuthors: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  coverUrl: true,
                },
              },
            },
          },
          _count: {
            select: {
              bookAuthors: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.author.count({ where }),
    ]);

    return NextResponse.json({
      authors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, biography, birthDate, nationality, website, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Author name is required" },
        { status: 400 },
      );
    }

    const author = await prisma.author.create({
      data: {
        name,
        biography,
        birthDate: birthDate ? new Date(birthDate) : null,
        nationality,
        website,
        imageUrl,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
