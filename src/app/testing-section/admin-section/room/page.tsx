"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

import {
  createRoom,
  getSpecifiedRoom,
  getSpecifiedLayout,
  getAllCinemas,
  getAllLayouts,
  createSeat,
  getAllCinemaRooms,
  getSpecifiedCinema,
} from "~/app/server-actions";

const RoomOperationsPage = () => {
  const [capacity, setCapacity] = useState<number>();
  const [cinemaOptions, setCinemaOptions] = useState([]);
  const [cinemaId, setCinemaId] = useState();
  const [layoutId, setLayoutId] = useState("");

  enum Status {
    Available = "Available",
    Booked = "Booked",
  }

  const [layoutOptions, setLayoutOptions] = useState([]);
  useEffect(() => {
    async function fetchCinemas() {
      const cinemas = await getAllCinemas();
      if (cinemas === undefined) return;
      const cinemaArr:
        | ((prevState: never[]) => never[])
        | { label: string; value: string }[] = [];
      cinemas.map((cinema) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        cinemaArr?.push({ label: cinema.name, value: cinema.id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setCinemaOptions(cinemaArr);
    }
    async function fetchLayouts() {
      const layouts = await getAllLayouts();
      if (layouts === undefined) return;
      const layoutArr:
        | ((prevState: never[]) => never[])
        | { label: string; value: string }[] = [];
      layouts.map((layout) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        layoutArr?.push({ label: layout.name, value: layout.id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setLayoutOptions(layoutArr);
    }

    void fetchCinemas();
    void fetchLayouts();
  }, []);

  const buildSeats = async (roomId: string) => {
    const room = await getSpecifiedRoom(roomId);
    if (!room) return;
    const layout = await getSpecifiedLayout(room.layoutId);
    if (!layout) return;
    const rows = layout.rows;
    const columns = layout.columns;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const newSeat = await createSeat({
          roomId: room.id,
          number: layout.seat_map[i][j],
          status: Status.Available,
        });
        console.log("New seat:", newSeat.data);
      }
    }
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (
        capacity === 0 ||
        capacity === undefined ||
        // roomNumber === "" ||
        // roomNumber === undefined ||
        cinemaId === undefined ||
        cinemaId === ""
      ) {
        return;
      }
      const cinemaRooms = await getAllCinemaRooms(cinemaId);
      const cinema = await getSpecifiedCinema(cinemaId);
      if (
        cinema === undefined ||
        cinema === null ||
        cinemaRooms === undefined
      ) {
        return;
      }
      if (cinemaRooms.length >= cinema.number_of_rooms) {
        console.log("Cannot create room. Max capacity reached.");
        return;
      }
      const layout = await getSpecifiedLayout(layoutId);
      if (!layout) return;
      if (layout?.total_seats > capacity) {
        console.log("Layout too small for this room.");
        return;
      }
      const newRoom = await createRoom({
        cinemaId,
        capacity,
        roomNumber: `Room ${cinemaRooms.length + 1}`,
        layoutId,
      });
      console.log("New room :", newRoom.data);
      if (!newRoom.data) return;
      await buildSeats(newRoom.data.id);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Room operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Room</h3>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            await handleCreateRoom(e);
          }}
        >
          <div>
            <label className="mb-1 block">Select a Cinema:</label>
            <Select
              options={cinemaOptions}
              onChange={(e) => {
                setCinemaId(e.value);
              }}
            ></Select>
          </div>

          {/* <div>
            <label className="mb-1 block">Room Number:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={roomNumber}
              onChange={(e) => {
                setRoomNumber(e.target.value);
              }}
            />
          </div> */}
          <div>
            <label className="mb-1 block">Capacity:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              min={0}
              step={10}
              value={capacity}
              onChange={(e) => {
                setCapacity(parseInt(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Select a Layout:</label>
            <Select
              options={layoutOptions}
              onChange={(e) => {
                setLayoutId(e.value);
              }}
            ></Select>
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

export default RoomOperationsPage;
