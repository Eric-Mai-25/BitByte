import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, type, rating, content } = await request.json();

  try {
    const review = await prisma.review.create({
      data: {
        title,
        type,
        rating,
        content,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to create review", details: errorMessage },
      { status: 500 }
    );
  }
}