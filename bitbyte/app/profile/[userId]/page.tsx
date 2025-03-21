import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function getUserAndReviews(userId:string) {
    const user = await prisma.users.findUnique({
        where: {id: userId}
    });

    const reviews = await prisma.review.findMany({
        where: {userId},
        orderBy: { createdAt: "desc"}
    });
    return {user, reviews};
}