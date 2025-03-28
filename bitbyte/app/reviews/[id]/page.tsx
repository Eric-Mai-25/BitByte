"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

type Review = {
  id: number;
  title: string;
  type: string;
  rating: number;
  content: string;
  createdAt: Date;
  userId: string;
  user: { id: string; name?: string | null };
};

type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  userId: string;
  user: { name?: string | null };
};

async function fetchReview(id: string): Promise<Review | null> {
  const res = await fetch(`/api/reviews/${id}`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchComments(reviewId: string): Promise<Comment[]> {
  const res = await fetch(`/api/comments?reviewId=${reviewId}`);
  if (!res.ok) return [];
  return res.json();
}

export default function ReviewPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise); // Unwrap params with React.use()
  const { data: session } = useSession();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchReview(params.id).then((data) => {
      if (!data) router.push("/404");
      setReview(data);
    });
    fetchComments(params.id).then(setComments);
  }, [params.id, router]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId: params.id, content: newComment }),
    });

    if (res.ok) {
      const addedComment = await res.json();
      setComments((prev) => [
        { ...addedComment, user: { name: session.user?.name } },
        ...prev,
      ]);
      setNewComment("");
    } else {
      alert("Failed to post comment.");
    }
  };

  if (!review) {
    return <p className="text-center mt-10">Loading...</p>;
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
        <p className="text-gray-500 text-sm mb-4">
          Posted on {new Date(review.createdAt).toLocaleDateString()} by{" "}
          <Link href={`/profile/${review.userId}`} className="text-blue-500 hover:underline">
            {review.user?.name || "Anonymous"}
          </Link>
        </p>
        <article className="prose prose-lg text-gray-800 mb-6">
          {review.content.split("\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        {/* Comment Section */}
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-gray-500 text-sm mt-1">
                  By {comment.user?.name || "Anonymous"} on{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}