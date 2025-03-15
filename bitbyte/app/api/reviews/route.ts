import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc"},
        take: 6,
    });
    return NextResponse.json(reviews)
}