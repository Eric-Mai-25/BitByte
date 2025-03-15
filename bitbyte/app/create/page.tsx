"use client";

import { useSession } from "next-auth/react";
import {useState} from "react";
import {useRouter} from "next/navigation"

export default function CreateReview(){
    const {data:session} = useSession();
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        type: "movie",
        rating: 1,
        content: "",
    });
    
    if(!session){
        return <p className="text-center mt-10">Please sign in to create a review</p>
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("api/reviews/create", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });
        if(response.ok) {
            router.push("/")
        } else {
            console.error("Failed to create review");

        }
    }
    
    return (
        <div className="min-h-screen black p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create a Review</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="movie">Movie</option>
              <option value="game">Game</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Rating (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
    )


}