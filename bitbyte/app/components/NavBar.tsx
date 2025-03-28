"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <Link href={"/"} className="text-white text-lg font-bold">
          BitByte
        </Link>
        <div className="flex items-center space-x-4">
          {session && (
            <Link href={"/create"} className="text-white hover:text-gray-300">
              Create Review
            </Link>
          )}
        </div>

        {/* Right Side: Login/Logout and Icon */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {/* User Icon from Google Profile */}
              {session.user?.image && (
                <Link href={`/profile/${session.user.id}`}>
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Link>
              )}
              <span className="text-white hidden md:block">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
