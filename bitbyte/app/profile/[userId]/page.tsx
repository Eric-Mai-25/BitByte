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

export default async function ProfilePage({
    params,
} : {
    params: {userId: string};
}) {
    const session = await getServerSession(authOptions);
    const uId = await params
    const {user, reviews} = await getUserAndReviews(uId.userId);
    if(!user) {
        notFound();
    }

    const isOwnProfile = session?.user?.id === uId.userId;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">
          {isOwnProfile ? "Your Profile" : `${user.name || "User"}’s Profile`}
        </h1>
        <p className="text-gray-700 mb-4">
          {isOwnProfile ? `Welcome, ${user.name}!` : `Viewing ${user.name || user.id}`}
        </p>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Link href={`/reviews/${review.id}`} key={review.id}>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                  <h3 className="text-xl font-semibold">{review.title}</h3>
                  <p className="text-gray-600">{review.type}</p>
                  <p className="text-lg font-bold text-blue-500">
                    Rating: {review.rating}/10
                  </p>
                  <p className="text-gray-700 line-clamp-2">{review.content}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {isOwnProfile
              ? "You haven’t created any reviews yet."
              : "This user hasn’t created any reviews yet."}
          </p>
        )}
      </div>
    </div>
    )
}