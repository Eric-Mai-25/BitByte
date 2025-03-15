"use client";

import { useSession } from "next-auth/react";
import {useState} from "react";

export default function CreateReview(){
    const {data:session} = useSession();

    if(!session){
        return <p className="text-center mt-10">Please sign in to create a review</p>
    }

    const [formData, setFormData] = useState({
        title: "",
        type: "movie",
        rating: 1,
        content: "",
    });

    
}