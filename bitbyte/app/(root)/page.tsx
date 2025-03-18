"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  title: string;
  type: string;
  rating: number;
  content: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error)
  }, []);


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