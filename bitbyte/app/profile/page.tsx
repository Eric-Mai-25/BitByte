"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type Review = {
    id: number;
    title: string;
    type: string;
    rating: number;
    content: string;
    createdAt: Date;
    userId: string;
  };

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user-reviews?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return (
      <p className="text-center mt-10">Please sign in to view your profile.</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <p className="text-gray-700 mb-4">Welcome, {session.user?.name}!</p>
        <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
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
          <p className="text-gray-500">You haven’t created any reviews yet.</p>
        )}
      </div>
    </div>
  );
}
