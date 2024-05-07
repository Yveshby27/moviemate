"use client";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllCinemaRooms,
  deleteRoom,
  getSpecifiedRoom,
  deleteAllRoomSeats,
} from "~/app/server-actions";
import AdminSeatMap from "~/app/components/AdminSeatMap";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const RoomList = () => {
  const cinemaId = "f49d1e33-2838-4ca1-9846-116cc76e791a";
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [loadingStates, setLoadingStates] = useState({});
  const [warnings, setWarnings] = useState({}); // State to track warnings for each layout
  const context = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../../admin-section");
    async function fetchRooms() {
      try {
        const allRooms = await getAllCinemaRooms(cinemaId);
        if (!allRooms) {
          return;
        }
        const roomObjArr = allRooms.map((room) => ({
          id: room?.id,
          number: room?.number,
          capacity: room?.capacity,
          screeningArr: room?.screenings,
          layout: room?.layout,
        }));
        setRooms(roomObjArr);
        setLoading(false); // Set loading to false after rooms are fetched
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    }
    fetchRooms();
  }, []);

  const handleDeleteRoom = async (roomId, index) => {
    try {
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [roomId]: "", // Reset warning for the layout
      }));
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [roomId]: true, // Set loading state to true for the current deletion
      }));
      const room = await getSpecifiedRoom(roomId);
      if (!room) return;
      if (room.screenings.length > 0) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [roomId]: "Cannot delete room. Currently in use.", // Set warning for the layout
        }));
        return;
      }
      await deleteAllRoomSeats(roomId);
      await deleteRoom(roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    } finally {
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [roomId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div>
      {loading ? ( // Display loading spinner while fetching rooms
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : (
        rooms.map((room, index) => (
          <div key={index} className="mb-4 border border-gray-200 p-4">
            <div className="font-bold">Number:{room.number}</div>
            <div>Capacity: {room.capacity}</div>
            <AdminSeatMap
              rows={room.layout.rows}
              columns={room.layout.columns}
            ></AdminSeatMap>
            {warnings[room.id] && (
              <div className="font-bold text-red-600">{warnings[room.id]}</div>
            )}
            <button
              onClick={async () => await handleDeleteRoom(room.id, index)}
              disabled={loadingStates[room.id]}
              className={`mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 ${
                loadingStates[room.id] ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loadingStates[room.id] ? (
                <ClipLoader color="white" size={20}></ClipLoader>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        ))
      )}
      <Link href="../room">
        <div className="focus:shadow-outline-blue mt-2 flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
          Back
        </div>
      </Link>
    </div>
  );
};

export default RoomList;
