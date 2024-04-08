import Link from "next/link";
import React from "react";

const AdminMainPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-3xl font-bold">ADMIN MAIN PAGE</h1>
      <div className="flex flex-col gap-4">
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

        <Link href="../testing-section">
          <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
            Test
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminMainPage;
