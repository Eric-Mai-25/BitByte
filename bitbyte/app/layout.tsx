import { Providers } from "./component/provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Auth App",
  description: "A simple app with Google authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}