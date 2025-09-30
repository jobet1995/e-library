import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, BookFormat } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const genreId = searchParams.get("genreId");
    const authorId = searchParams.get("authorId");
    const featured = searchParams.get("featured") === "true";
    const format = searchParams.get("format");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrderParam = searchParams.get("sortOrder") || "desc";
    const sortOrder = sortOrderParam === "asc" ? "asc" : "desc"; // Ensure it's either 'asc' or 'desc'
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = { isAvailable: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { isbn13: { contains: search, mode: "insensitive" } },
        { isbn10: { contains: search, mode: "insensitive" } },
        {
          bookAuthors: {
            some: {
              author: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (genreId) {
      where.bookGenres = {
        some: {
          genreId: genreId,
        },
      };
    }

    if (authorId) {
      where.bookAuthors = {
        some: {
          authorId: authorId,
        },
      };
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (format) {
      where.format = format as BookFormat;
    }

    // Create a type-safe orderBy object
    const orderBy = { [sortBy]: sortOrder } as const;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          bookAuthors: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
          series: {
            select: {
              id: true,
              name: true,
            },
          },
          bookGenres: {
            include: {
              genre: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          bookTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
              borrows: true,
              wishlistItems: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.book.count({ where }),
    ]);

    // Get categories for filtering
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      categories,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
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
      title,
      subtitle,
      description,
      isbn13,
      isbn10,
      publishedDate,
      pageCount,
      language = "en",
      format = "PDF",
      fileSize,
      coverUrl,
      fileUrl,
      previewUrl,
      uploadedBy,
      categoryId,
      publisherId,
      seriesId,
      seriesNumber,
      authors = [],
      genres = [],
      tags = [],
      isFeatured = false,
    } = body;

    if (!title || !fileUrl || !uploadedBy) {
      return NextResponse.json(
        { error: "Title, file URL, and uploader are required" },
        { status: 400 },
      );
    }

    // Create book with transaction for data integrity
    const book = await prisma.$transaction(async (tx) => {
      // Create the book
      const newBook = await tx.book.create({
        data: {
          title,
          subtitle,
          description,
          isbn13,
          isbn10,
          publishedDate: publishedDate ? new Date(publishedDate) : null,
          pageCount,
          language,
          format,
          fileSize,
          coverUrl,
          fileUrl,
          previewUrl,
          uploadedBy,
          categoryId,
          publisherId,
          seriesId,
          seriesNumber,
          isFeatured,
        },
      });

      // Add authors
      if (authors.length > 0) {
        type BookAuthorData = {
          authorId: string;
          role?: string;
        };

        await tx.bookAuthor.createMany({
          data: (authors as BookAuthorData[]).map((author) => ({
            bookId: newBook.id,
            authorId: author.authorId,
            role: author.role || "Author",
          })),
        });
      }

      // Add genres
      if (genres.length > 0) {
        await tx.bookGenre.createMany({
          data: genres.map((genreId: string) => ({
            bookId: newBook.id,
            genreId,
          })),
        });
      }

      // Add tags
      if (tags.length > 0) {
        await tx.bookTag.createMany({
          data: tags.map((tagId: string) => ({
            bookId: newBook.id,
            tagId,
          })),
        });
      }

      return newBook;
    });

    // Fetch the complete book with relationships
    const completeBook = await prisma.book.findUnique({
      where: { id: book.id },
      include: {
        bookAuthors: {
          include: {
            author: true,
          },
        },
        category: true,
        publisher: true,
        series: true,
        bookGenres: {
          include: {
            genre: true,
          },
        },
        bookTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(completeBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
