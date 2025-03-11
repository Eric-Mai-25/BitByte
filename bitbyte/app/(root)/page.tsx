"use client";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}!</p>
        <button onClick={() => signOut()}> Sign Out</button>
      </div>
    )
  }


  return (
    <div>
      <p>You are not signed in.</p>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  )
}