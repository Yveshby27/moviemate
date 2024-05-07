"use client";
import React, { useEffect, useState } from "react";
import {
  getAllUserReservations,
  getSpecifiedMovie,
  deleteReservation,
  updateScreening,
  getSpecifiedScreening,
  getSpecifiedReservation,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserReservations = () => {
  const context = useUserContext();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({}); // State to track loading for each deletion
  const router = useRouter();

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (currentUserId === "" || !currentUserId) {
      router.push("../../login-section");
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await getAllUserReservations(context.currentUserId);
        if (data.length === 0) {
          setLoading(false);
          return;
        }
        const reservationArr = [];
        const loadingObj = {};
        for (let i = 0; i < data?.length; i++) {
          const movie = await getSpecifiedMovie(data[i]?.screening.movieId);
          const obj = {
            id: data[i]?.id, // Assuming each reservation has an ID
            screeningTime: new Date(
              data[i]?.screening.screening_time,
            ).toLocaleString(),
            movie: movie?.title,
            movieLength: movie?.length,
            seats: data[i]?.seats,
            totalAmount: data[i]?.total_amount,
          };
          reservationArr.push(obj);
          loadingObj[data[i]?.id] = false; // Initialize loading state for each reservation
        }
        setReservations(reservationArr);
        setLoadingStates(loadingObj);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId, index) => {
    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        [reservationId]: true, // Set loading state to true for the current deletion
      }));
      const reservation = await getSpecifiedReservation(reservationId);
      const screening = await getSpecifiedScreening(reservation?.screening.id);
      await deleteReservation(reservationId);
      // After successful deletion, update reservations state
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId,
        ),
      );
      await updateScreening({
        screeningId: screening.id,
        availableSeats: screening?.available_seats + 1,
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [reservationId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div>
      {loading ? (
        // Display loading spinner while fetching reservations
        <div className="flex justify-center">
          <ClipLoader color="#3B82F6" size={35} />
        </div>
      ) : reservations.length === 0 ? (
        // Display message if there are no reservations
        <div>No reservations found.</div>
      ) : (
        // Display reservations
        <div className="mt-4">
          {reservations.map((reservation, index) => (
            <div key={index} className="mb-4 border border-gray-200 p-4">
              <div className="font-bold">Reservation {index + 1}</div>
              <div>Date: {reservation.screeningTime}</div>
              <div>Movie: {reservation.movie}</div>
              <div>Length: {reservation.movieLength} Minutes</div>
              <div>
                Seats:
                {reservation.seats.map((seat, seatIndex) => (
                  <span key={seatIndex}>
                    {seat.number}
                    {seatIndex !== reservation.seats.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
              <div>
                Amount: {reservation.totalAmount * reservation.seats.length}$
              </div>
              <button
                onClick={async () =>
                  await handleDeleteReservation(reservation.id, index)
                }
                disabled={loadingStates[reservation.id]} // Disable the button while loading
                className={`mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 ${
                  loadingStates[reservation.id]
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {loadingStates[reservation.id] ? (
                  <ClipLoader color="white" size={20}></ClipLoader>
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
          ))}
          <Link href="../mainpage">
            <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
              Back
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserReservations;
