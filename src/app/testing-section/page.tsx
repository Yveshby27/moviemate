"use client";
import Link from "next/link";
import React from "react";
const TestingPage = () => {
  return (
    <div>
      <Link href="../testing-section/admin-section/cinema">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Cinema Operations
        </button>
      </Link>
      <Link href="../testing-section/admin-section/room">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Room Operations
        </button>
      </Link>
      <Link href="../testing-section/admin-section/screening">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Screening Operations
        </button>
      </Link>
      <Link href="../testing-section/admin-section/movie">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Movie Operations
        </button>
      </Link>
      <Link href="../testing-section/admin-section/layout">
        <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
          Layout Operations
        </button>
      </Link>
    </div>
  );
};

export default TestingPage;
