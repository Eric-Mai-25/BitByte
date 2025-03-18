import { PrismaClient } from "@prisma/client";
import { notFound} from "next/navigation";

const prisma = new PrismaClient();

async function getReview(id:string){
    const review = await prisma. review.findUnique({
        where: {id: Number(id)}
    })
}