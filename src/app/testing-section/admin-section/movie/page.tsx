"use client";
import React, { useState } from "react";
import { createMovie } from "~/app/server-actions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const MovieOperationsPage = () => {
  const [title, setTitle] = useState("");
  const [length, setLength] = useState<number>();
  const [releaseDate, setReleaseDate] = useState<string>();
  const handleCreateMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (
        title === undefined ||
        title === "" ||
        length === undefined ||
        releaseDate === undefined ||
        releaseDate === ""
      ) {
        return;
      }
      const newMovie = await createMovie({ title, length, releaseDate });
      console.log("New movie:", newMovie.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
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
              onChange={(e) => {
                setLength(parseInt(e.target.value));
              }}
            />
          </div>
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

          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieOperationsPage;
