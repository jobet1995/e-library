import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as
      | "PENDING"
      | "PAID"
      | "WAIVED"
      | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    const where: {
      userId?: string;
      status?: "PENDING" | "PAID" | "WAIVED";
    } = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [fines, total] = await Promise.all([
      prisma.fine.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          borrow: {
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
        },
        skip,
        take: limit,
        orderBy: { createdDate: "desc" },
      }),
      prisma.fine.count({ where }),
    ]);

    return NextResponse.json({
      fines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching fines:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, borrowId, amount, reason, description } = body;

    if (!userId || !amount || !reason) {
      return NextResponse.json(
        { error: "User ID, amount, and reason are required" },
        { status: 400 },
      );
    }

    const fine = await prisma.fine.create({
      data: {
        userId,
        borrowId,
        amount: parseFloat(amount),
        reason,
        description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        borrow: {
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
      },
    });

    return NextResponse.json(fine, { status: 201 });
  } catch (error) {
    console.error("Error creating fine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { fineId, status, waivedBy } = body;

    if (!fineId || !status) {
      return NextResponse.json(
        { error: "Fine ID and status are required" },
        { status: 400 },
      );
    }

    interface FineUpdateData {
      status: "PENDING" | "PAID" | "WAIVED";
      paidDate?: Date;
      waivedDate?: Date;
      waivedBy?: string;
    }

    const updateData: FineUpdateData = { status };

    if (status === "PAID") {
      updateData.paidDate = new Date();
    } else if (status === "WAIVED") {
      updateData.waivedDate = new Date();
      if (waivedBy) {
        updateData.waivedBy = waivedBy;
      }
    }

    const fine = await prisma.fine.update({
      where: { id: fineId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        borrow: {
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
      },
    });

    return NextResponse.json(fine);
  } catch (error) {
    console.error("Error updating fine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
