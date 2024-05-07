"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  createScreening,
  getAllCinemaRooms,
  getAllMovies,
  getSpecifiedRoom,
  getAllRoomScreenings,
  getSpecifiedMovie,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const ScreeningOperationsPage = () => {
  const cinemaId = "f49d1e33-2838-4ca1-9846-116cc76e791a";
  const context = useUserContext();
  const router = useRouter();
  const [roomId, setRoomId] = useState();
  const [movieId, setMovieId] = useState();
  const [screeningTime, setScreeningTime] = useState();
  const [roomOptions, setRoomOptions] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seatPrice, setSeatPrice] = useState();
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

  const checkTimeConflict = async () => {
    const roomScreenings = await getAllRoomScreenings(roomId);
    const movie = await getSpecifiedMovie(movieId);
    const movieLengthInMinutes = movie?.length;

    if (!screeningTime || !roomScreenings) return false;

    const currentScreeningStart = new Date(screeningTime);
    const currentScreeningEnd = new Date(
      currentScreeningStart.getTime() + movieLengthInMinutes * 60000,
    );

    for (const roomScreening of roomScreenings) {
      const reservedScreeningStart = new Date(roomScreening.screening_time);
      const reservedScreeningMovie = await getSpecifiedMovie(
        roomScreening.movieId,
      );

      if (!reservedScreeningMovie) continue;

      const reservedScreeningEnd = new Date(
        reservedScreeningStart.getTime() +
          reservedScreeningMovie.length * 60000,
      );

      // Check if the new screening overlaps with any existing screening
      if (
        currentScreeningStart < reservedScreeningEnd &&
        currentScreeningEnd > reservedScreeningStart
      ) {
        console.log(
          "TIME CONFLICT: New screening overlaps with an existing screening.",
        );
        return true;
      }

      // Check if the new screening starts before any existing screening
      if (
        currentScreeningStart < reservedScreeningStart &&
        currentScreeningEnd > reservedScreeningStart
      ) {
        console.log(
          "TIME CONFLICT: New screening starts before an existing screening ends.",
        );
        return true;
      }
    }
    return false;
  };

  const handleCreateScreening = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setMessage("");
      setIsLoading(true);
      if (
        roomId === undefined ||
        roomId === "" ||
        movieId === undefined ||
        movieId === "" ||
        screeningTime === undefined ||
        screeningTime === "" ||
        seatPrice === undefined ||
        seatPrice === ""
      ) {
        setWarning("Fill all fields");
        setIsLoading(false);
        return;
      }
      const room = await getSpecifiedRoom(roomId);
      if (!room) return;
      const timeConflict = await checkTimeConflict();
      if (timeConflict === true) {
        setWarning("Time conflict with another screening");
        setIsLoading(false);
        return;
      }
      const newScreening = await createScreening({
        roomId,
        movieId,
        screeningTime,
        availableSeats: room.capacity,
        seatPrice,
      });
      setIsLoading(false);
      console.log("New screening :", newScreening.data);
      setWarning("");
      setMessage("Screening created");
    } catch (error) {
      setIsLoading(false);
      setWarning("An error occured while creating screening");
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
  }, []);
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
                  setScreeningTime(e);
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label className="mb-1 block">Ticket price:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              value={seatPrice}
              onChange={(e) => {
                setSeatPrice(parseInt(e.target.value));
              }}
            />
          </div>
          <div className="font-bold text-red-600">{warning}</div>
          <div className="font-bold text-green-600">{message}</div>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading && <div>Submit</div>}
            {isLoading && <ClipLoader color="white" size={20}></ClipLoader>}
          </button>
        </form>
        <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
          <Link href="../operations/screening/room-schedule">
            Check room schedule
          </Link>
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

export default ScreeningOperationsPage;
