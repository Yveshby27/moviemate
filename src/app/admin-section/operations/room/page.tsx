"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  createRoom,
  getSpecifiedRoom,
  getSpecifiedLayout,
  getAllLayouts,
  createSeat,
  getAllCinemaRooms,
  getSpecifiedCinema,
} from "~/app/server-actions";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const RoomOperationsPage = () => {
  const [capacity, setCapacity] = useState<number>();
  const [layoutId, setLayoutId] = useState("");
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cinemaId = "f49d1e33-2838-4ca1-9846-116cc76e791a";
  const context = useUserContext();
  const router = useRouter();
  const [layoutOptions, setLayoutOptions] = useState([]);

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
    async function fetchLayouts() {
      try {
        const layouts = await getAllLayouts();
        if (layouts) {
          const layoutArr = layouts.map((layout) => ({
            label: `${layout.name}-${layout.total_seats} seats`,
            value: layout.id,
          }));
          setLayoutOptions(layoutArr);
        }
      } catch (error) {
        console.error("Error fetching layouts:", error);
      }
    }

    fetchLayouts();
  }, []);

  const buildSeats = async (roomId: string) => {
    try {
      const room = await getSpecifiedRoom(roomId);
      const layout = await getSpecifiedLayout(room.layoutId);
      if (room && layout) {
        const rows = layout.rows;
        const columns = layout.columns;
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            const newSeat = await createSeat({
              roomId: room.id,
              number: layout.seat_map[i][j],
            });
            console.log("New seat:", newSeat.data);
          }
        }
      }
    } catch (error) {
      console.error("Error building seats:", error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setWarning("");
    setIsLoading(true);

    try {
      if (!capacity || !layoutId) {
        setWarning("Please fill all fields");
        setIsLoading(false);
        return;
      }

      const cinemaRooms = await getAllCinemaRooms(cinemaId);
      const cinema = await getSpecifiedCinema(cinemaId);

      if (!cinema || !cinemaRooms) {
        setWarning("Error fetching cinema data");
        setIsLoading(false);
        return;
      }

      if (cinemaRooms.length >= cinema.number_of_rooms) {
        setWarning("Cannot create room. Max capacity reached.");
        setIsLoading(false);
        return;
      }

      const layout = await getSpecifiedLayout(layoutId);

      if (!layout) {
        setWarning("Error fetching layout data");
        setIsLoading(false);
        return;
      }

      if (layout.total_seats !== capacity) {
        setWarning("Room capacity has to reach layout seat count.");
        setIsLoading(false);
        return;
      }

      const newRoom = await createRoom({
        cinemaId,
        capacity,
        roomNumber: `Room ${cinemaRooms.length + 1}`,
        layoutId,
      });

      if (newRoom.data) {
        await buildSeats(newRoom.data.id);
        setMessage("Room created");
      } else {
        setWarning("Error creating room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setWarning("An error occurred while creating room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Room operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Room</h3>
        <form className="space-y-2" onSubmit={handleCreateRoom}>
          <div>
            <label className="mb-1 block">Capacity:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              min={0}
              step={5}
              value={capacity || ""}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block">Select a Layout:</label>
            <Select
              options={layoutOptions}
              onChange={(e) => setLayoutId(e.value)}
            />
          </div>
          <div className="font-bold text-red-600">{warning}</div>
          <div className="font-bold text-green-600">{message}</div>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
          </button>
        </form>
        <button className=" mt-2 rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
          <Link href="../operations/room/room-list">Check room list</Link>
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

export default RoomOperationsPage;
