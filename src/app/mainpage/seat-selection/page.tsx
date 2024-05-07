"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useUserContext } from "~/app/context";
import UserSeatMap from "~/app/components/UserSeatMap";
import { getAllMovieScreenings } from "~/app/server-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Booking = () => {
  const context = useUserContext();
  const [showtimeOptions, setShowtimeOptions] = useState([]);
  const [screeningId, setScreeningId] = useState("");

  const router = useRouter();
  async function fetchShowtimes() {
    const screenings = await getAllMovieScreenings(context.selectedMovieId);
    if (screenings === undefined) return;

    const currentDateTime = new Date();
    const showtimeArr = [];

    screenings.forEach((screening) => {
      if (new Date(screening.screening_time) >= currentDateTime) {
        // Filter out screenings before the current time
        showtimeArr.push({
          label: new Date(screening.screening_time).toLocaleString(),
          value: screening.id,
        });
      }
    });

    setShowtimeOptions(showtimeArr);
  }

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId === "" || !currentUserId) {
      router.push("../../login-section");
    }
    void fetchShowtimes();
  }, []);
  return (
    <div>
      <div>
        <label className="mb-1">Showtimes:</label>
        <Select
          options={showtimeOptions}
          onChange={(e) => {
            setScreeningId(e.value);
          }}
        ></Select>
      </div>
      <UserSeatMap
        screeningId={screeningId}
        movieId={context.selectedMovieId}
      ></UserSeatMap>
      <Link href="../mainpage">
        <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
          Back
        </div>
      </Link>
    </div>
  );
};

export default Booking;
