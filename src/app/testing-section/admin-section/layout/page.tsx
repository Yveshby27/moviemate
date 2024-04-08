"use client";
import React, { useState } from "react";
import { createLayout } from "~/app/server-actions";

const LayoutOperationsPage = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [totalSeats, setTotalSeats] = useState<number>();
  const [seatMap, setSeatMap] = useState<string[][]>();

  const buildSeatMap = () => {
    if (!rows || !columns) {
      // Ensure all necessary values are provided
      console.error("Invalid dimensions or total seats.");
      return;
    }

    const builtSeatMap: string[][] = []; // Initialize seat map array

    for (let i = 0; i < rows; i++) {
      // Loop through each row
      const row: string[] = [];
      for (let j = 0; j < columns; j++) {
        // Loop through each column
        const seatNumber = String.fromCharCode(65 + i) + (j + 1); // Generate seat number (e.g., A1, B2, etc.)
        row.push(seatNumber); // Add seat to the row
      }
      builtSeatMap.push(row); // Add row to the seat map
    }

    setSeatMap(builtSeatMap); // Update seat map state
  };

  const handleCreateLayout = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (
        name === undefined ||
        name === "" ||
        rows === undefined ||
        columns === undefined
      ) {
        return;
      }
      setTotalSeats(rows * columns);
      buildSeatMap();
      console.log("Seat map:", seatMap);
      if (seatMap === undefined || totalSeats === undefined) {
        return;
      }
      const newLayout = await createLayout({
        name,
        rows,
        columns,
        totalSeats,
        seatMap,
      });
      console.log("New Layout:", newLayout);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Layout operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Layout</h3>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            await handleCreateLayout(e);
          }}
        >
          <div>
            <label className="mb-1 block">Layout Name:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Number of Rows:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              value={rows}
              onChange={(e) => {
                setRows(parseInt(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Number of Columns:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              value={columns}
              onChange={(e) => {
                setColumns(parseInt(e.target.value));
              }}
            />
          </div>

          {/* <div>
            <label className="mb-1 block">Total number of seats:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              step={10}
              value={totalSeats}
              onChange={(e) => {
                setTotalSeats(parseInt(e.target.value));
              }}
            />
          </div> */}
          <div>Total seats:{rows * columns}</div>
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

export default LayoutOperationsPage;
