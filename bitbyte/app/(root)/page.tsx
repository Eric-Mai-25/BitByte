"use client";
import Image from "next/image";
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  return(
    <>
    </>
  )
}