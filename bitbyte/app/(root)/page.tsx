"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface Review {
  id: number;
  title: string;
  type: string;
  rating: number;
  content: string;
  userId: string;
  user: {name?:string | null};
}

export default function Home() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error)
  }, []);

  const handleProfileClick = (userId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${userId}`)
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Bit Byte Reviews</h1>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <Link href={`/reviews/${review.id}`} key={review.id}>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                  <h2 className="text-xl font-semibold">{review.title}</h2>
                  <p className="text-gray-600">{review.type}</p>
                  <p className="text-lg font-bold text-blue-500">
                    Rating: {review.rating}/10
                  </p>
                  <p className="text-gray-700 line-clamp-2">{review.content}</p>
                  {/* <Link href={`/profile/${review.userId}`} className="text-blue-500 hover:underline">
                    by {review.user?.name || "Anonymous"}
                  </Link> */}
                  <span
                    onClick={(e) => handleProfileClick(review.userId, e)}
                    className="text-blue-500 hover:underline cursor-pointer"
                    >
                      by {review.user?.name || "Anonymous"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No reviews yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}