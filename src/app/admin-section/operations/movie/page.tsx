"use client";
import React, { useState, useEffect } from "react";
import { createMovie } from "~/app/server-actions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "~/app/context";
const MovieOperationsPage = () => {
  const [title, setTitle] = useState("");
  const [length, setLength] = useState<number>();
  const [releaseDate, setReleaseDate] = useState<string>();
  const [description, setDescription] = useState("");
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const router = useRouter();
  const handleCreateMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setMessage("");
      setIsLoading(true);
      if (
        title === undefined ||
        title === "" ||
        length === undefined ||
        releaseDate === undefined ||
        releaseDate === "" ||
        description === undefined ||
        description === ""
      ) {
        setWarning("Fill all fields");
        setIsLoading(false);
        return;
      }

      const newMovie = await createMovie({
        title,
        length,
        releaseDate,
        description,
      });

      setWarning("");
      setMessage("Movie created");
      console.log("New movie:", newMovie.data);
    } catch (error) {
      setWarning("An error occurred while creating movie");
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Movie operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Movie</h3>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            await handleCreateMovie(e);
          }}
        >
          <div>
            <label className="mb-1 block">Movie title:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Length:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              value={length}
              step={5}
              onChange={(e) => {
                setLength(parseInt(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Movie description:</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={releaseDate}
                onChange={(e) => {
                  if (e === null) return;
                  // eslint-disable-next-line @typescript-eslint/unbound-method
                  console.log("release date:", e?.toString());
                  if (e?.toString() === undefined) return;
                  setReleaseDate(e);
                }}
              />
            </LocalizationProvider>
          </div>

          <div className="font-bold text-red-600">{warning}</div>
          <div className="font-bold text-green-600">{message}</div>
          <div>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              type="submit"
            >
              {!isLoading && <div>Submit</div>}
              {isLoading && <ClipLoader color="white" size={20}></ClipLoader>}
            </button>
          </div>
        </form>
        <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
          <Link href="../operations/movie/movie-list">Check movie list</Link>
        </button>
        <Link href="../operations">
          <div className="focus:shadow-outline-blue mt-2 flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MovieOperationsPage;
