import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

async function getReview(id: string) {
  const review = await prisma.review.findUnique({
    where: { id: Number(id) },
    include: {user: { select: { id: true, name:true }}}
  });
  return review;
}

export default async function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const review = await getReview(resolvedParams.id);

  if (!review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">{review.title}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-gray-600 capitalize">{review.type}</span>
          <span className="text-lg font-bold text-blue-500">
            Rating: {review.rating}/10
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Posted on {new Date(review.createdAt).toLocaleDateString()}
        </p>
        <article className="prose prose-lg text-gray-800">
          {review.content
            .split("\n")
            .map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
        </article>
      </div>
    </div>
  );
}
