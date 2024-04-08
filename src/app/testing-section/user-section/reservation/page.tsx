"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  createScreening,
  getAllCinemaRooms,
  getAllMovies,
  getSpecifiedRoom,
} from "~/app/server-actions";

const ScreeningOperationsPage = () => {
  const cinemaId = "5fbb1455-5a75-4b62-8826-d98ee4c298d9";
  const [roomId, setRoomId] = useState();
  const [movieId, setMovieId] = useState();
  const [screeningTime, setScreeningTime] = useState();
  const [roomOptions, setRoomOptions] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getAllCinemaRooms(cinemaId);
      if (rooms === undefined) return;
      const roomArr = [];
      rooms.map((room) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        roomArr?.push({ label: room.number, value: room.id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setRoomOptions(roomArr);
    }
    async function fetchMovies() {
      const movies = await getAllMovies();
      if (movies === undefined) return;
      const movieArr = [];
      movies.map((movie) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        movieArr?.push({ label: movie.title, value: movie.id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setMovieOptions(movieArr);
    }
    void fetchRooms();
    void fetchMovies();
  }, []);

  const handleCreateScreening = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (
        roomId === undefined ||
        roomId === "" ||
        movieId === undefined ||
        movieId === "" ||
        screeningTime === undefined ||
        screeningTime === ""
      ) {
        return;
      }
      const room = await getSpecifiedRoom(roomId);
      const newScreening = await createScreening({
        roomId,
        movieId,
        screeningTime,
        availableSeats: room?.capacity,
      });
      console.log("New room :", newScreening.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Screening operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Screening</h3>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            await handleCreateScreening(e);
          }}
        >
          <div>
            <label className="mb-1 block">Select Room:</label>
            <Select
              options={roomOptions}
              onChange={(e) => {
                setRoomId(e.value);
              }}
            ></Select>
          </div>

          <div>
            <label className="mb-1 block">Select Movie:</label>
            <Select
              options={movieOptions}
              onChange={(e) => {
                setMovieId(e.value);
              }}
            ></Select>
          </div>
          <div>
            <label className="mb-1 block">Screening Time:</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={screeningTime}
                onChange={(e) => {
                  // eslint-disable-next-line @typescript-eslint/unbound-method
                  console.log("date:", e?.toString());
                  setScreeningTime(e);
                }}
              />
            </LocalizationProvider>
          </div>
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

export default ScreeningOperationsPage;
