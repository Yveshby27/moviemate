"use client";
import Link from "next/link";
import React from "react";

const AdminLandingPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mt-4 flex flex-col gap-4">
        <Link href="../admin-section/login-section">
          <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
            Login
          </button>
        </Link>
        <Link href="../admin-section/signup-section">
          <button className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none">
            Sign Up
          </button>
        </Link>
        <Link href="/">
          <button className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminLandingPage;
