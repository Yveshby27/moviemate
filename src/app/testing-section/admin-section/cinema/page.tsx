"use client";
import React, { useState } from "react";
import { createCinema } from "~/app/server-actions";

const CinemaOperationsPage = () => {
  const [name, setName] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState<number>();

  const handleCreateCinema = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (numberOfRooms === undefined || numberOfRooms === 0 || name === "") {
        return;
      }
      const newCinema = await createCinema({ name, numberOfRooms });
      console.log("New cinema:", newCinema.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Cinema operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Cinema</h3>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            await handleCreateCinema(e);
          }}
        >
          <div>
            <label className="mb-1 block">Cinema Name:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Number of Rooms:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              min={0}
              value={numberOfRooms}
              onChange={(e) => {
                setNumberOfRooms(parseInt(e.target.value));
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

export default CinemaOperationsPage;
