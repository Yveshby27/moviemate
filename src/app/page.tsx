"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllMovies } from "./server-actions";

const UserLandingPage = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [showingNow, setShowingNow] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAllMovies() {
      const movies = await getAllMovies();
      setAllMovies(movies);
    }
    fetchAllMovies();
  }, []);

  const handleToggle = () => {
    setShowingNow((prevState) => !prevState);
  };

  const handleMovieClick = () => {
    router.push("../login-section");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to MovieMate</h1>
      <div className="mb-4 mt-5 flex">
        <button
          className={`mr-4 rounded-full px-4 py-2 focus:outline-none ${
            showingNow ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={handleToggle}
        >
          Showing Now
        </button>
        <button
          className={`rounded-full px-4 py-2 focus:outline-none ${
            !showingNow ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={handleToggle}
        >
          Coming Soon
        </button>
      </div>
      <div className="mt-8 flex overflow-x-auto">
        {allMovies
          .filter((movie) => {
            const currentDate = new Date();
            const releaseDate = new Date(movie.release_date);
            return showingNow
              ? releaseDate <= currentDate
              : releaseDate > currentDate;
          })
          .map((movie, index) => (
            <div
              key={index}
              onClick={() => handleMovieClick()}
              className={`movie-item relative mr-4 rounded-md bg-gray-200 p-4`}
              style={{ width: "200px", height: "300px" }}
            >
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-gray-600">Description: {movie.description}</p>
              {!showingNow && (
                <p className="text-gray-600">
                  Release date:
                  {new Date(movie.release_date).toLocaleDateString()}
                </p>
              )}
              <p className="text-gray-600">Length: {movie.length} Minutes</p>
            </div>
          ))}
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Link href="../login-section">
          <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
            Login
          </button>
        </Link>
        <Link href="../signup-section">
          <button className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none">
            Sign Up
          </button>
        </Link>
        <Link href="../admin-section">
          <button className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none">
            Go to admin section
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserLandingPage;
