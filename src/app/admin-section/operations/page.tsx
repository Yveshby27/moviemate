"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useUserContext } from "~/app/context";

const AllOperationsPage = () => {
  const context = useUserContext();
  const router = useRouter();
  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../admin-section");
  }, []);
  const handleLogout = () => {
    localStorage.setItem("adminId", "");
    router.push("../admin-section");
  };
  return (
    <div className="mt-3 flex gap-5">
      <Link href="../admin-section/operations/cinema">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Cinema Operations
        </button>
      </Link>
      <Link href="../admin-section/operations/room">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Room Operations
        </button>
      </Link>
      <Link href="../admin-section/operations/screening">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Screening Operations
        </button>
      </Link>
      <Link href="../admin-section/operations/movie">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Movie Operations
        </button>
      </Link>
      <Link href="../admin-section/operations/layout">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Layout Operations
        </button>
      </Link>
      <button
        className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
    </div>
  );
};

export default AllOperationsPage;
