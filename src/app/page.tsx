"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem("token");

    if (token) {
      // Jika sudah login, arahkan ke articles
      router.push("/articles");
    } else {
      // Jika belum login, arahkan ke halaman login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl">Loading...</h2>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
