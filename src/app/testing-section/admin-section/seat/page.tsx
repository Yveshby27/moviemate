"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { createSeat, getAllCinemaRooms } from "~/app/server-actions";

const SeatOperationsPage = () => {
  const cinemaId = "5fbb1455-5a75-4b62-8826-d98ee4c298d9";
  const [number, setNumber] = useState("");
  const [roomId, setRoomId] = useState();
  const [roomOptions, setRoomOptions] = useState();
  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getAllCinemaRooms(cinemaId);
      if (rooms === undefined) return;
      const roomArr = [];
      rooms.map((room) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        roomArr.push({ label: `${room.number}`, value: room.id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setRoomOptions(roomArr);
    }
    void fetchRooms();
  }, []);

  const handleCreateSeat = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (
        roomId === "" ||
        roomId === undefined ||
        number === "" ||
        number === undefined
      ) {
        return;
      }
      const newSeat = await createSeat({ roomId, number, isBooked: false });
      console.log("New room :", newSeat.data);
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
            await handleCreateSeat(e);
          }}
        >
          <div>
            <label className="mb-1 block">Select a Room:</label>
            <Select
              options={roomOptions}
              onChange={(e) => {
                setRoomId(e.value);
              }}
            ></Select>
          </div>

          <div>
            <label className="mb-1 block">Room Number:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
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

export default SeatOperationsPage;
