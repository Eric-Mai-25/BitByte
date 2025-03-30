import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comments.findMany({
      where: { reviewId: Number(reviewId), parentId: null }, // Top-level comments only
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        replies: {
          include: { user: { select: { name: true } } }, // Nested replies
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reviewId, content, parentId } = await request.json();

  if (!reviewId || !content) {
    return NextResponse.json(
      { error: "Review ID and content required" },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comments.create({
      data: {
        content,
        userId: session.user.id,
        reviewId: Number(reviewId),
        parentId: parentId ? Number(parentId) : null, // Optional parentId for replies
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create comment", details: error.message },
      { status: 500 }
    );
  }
}