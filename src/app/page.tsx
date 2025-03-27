// app/page.tsx

"use client"; // Add this to mark the file as a client component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page on load
    router.push("/login");
  }, [router]);

  return null; // Return null since the page will redirect immediately
}
