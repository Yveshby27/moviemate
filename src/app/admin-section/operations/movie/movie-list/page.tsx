"use client";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllMovies,
  deleteMovie,
  getSpecifiedMovie,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [loadingStates, setLoadingStates] = useState({});
  const [warnings, setWarnings] = useState({}); // State to track warnings for each layout
  const context = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../../admin-section");
    async function fetchMovies() {
      try {
        const allMovies = await getAllMovies();
        if (!allMovies) {
          return;
        }
        const movieObjArr = allMovies.map((movie) => ({
          id: movie?.id,
          title: movie?.title,
          length: movie?.length,
          description: movie?.description,
          releaseDate: movie?.release_date,
          screeningArr: movie?.screenings,
        }));
        setMovies(movieObjArr);
        setLoading(false); // Set loading to false after movies are fetched
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  const handleDeleteMovie = async (movieId, index) => {
    try {
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [movieId]: "", // Reset warning for the layout
      }));
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [movieId]: true, // Set loading state to true for the current deletion
      }));
      const movie = await getSpecifiedMovie(movieId);
      if (!movie) return;
      if (movie.Screening.length > 0) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [movieId]: "Cannot delete movie. Currently in use.", // Set warning for the layout
        }));
        return;
      }
      await deleteMovie(movieId);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId),
      );
    } catch (error) {
      console.error("Error deleting movie:", error);
    } finally {
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [movieId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div>
      {loading ? ( // Display loading spinner while fetching movies
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : (
        movies.map((movie, index) => (
          <div key={index} className="mb-4 border border-gray-200 p-4">
            <div className="font-bold">Title:{movie.title}</div>
            <div>Description: {movie.description}</div>
            <div>Length: {movie.length} minutes</div>
            <div>
              Release date: {new Date(movie.releaseDate).toLocaleDateString()}
            </div>
            {warnings[movie.id] && (
              <div className="font-bold text-red-600">{warnings[movie.id]}</div>
            )}
            <button
              onClick={async () => await handleDeleteMovie(movie.id, index)}
              disabled={loadingStates[movie.id]}
              className={`mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 ${
                loadingStates[movie.id] ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loadingStates[movie.id] ? (
                <ClipLoader color="white" size={20}></ClipLoader>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        ))
      )}
      <Link href="../movie">
        <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
          Back
        </div>
      </Link>
    </div>
  );
};

export default MovieList;
