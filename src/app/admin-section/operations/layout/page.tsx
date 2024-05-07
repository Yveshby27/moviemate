"use client";
import React, { useState, useEffect } from "react";
import { createLayout } from "~/app/server-actions";
import { ClipLoader } from "react-spinners";
import AdminSeatMap from "~/app/components/AdminSeatMap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "~/app/context";
const LayoutOperationsPage = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setWarning("");
    setIsLoading(true);

    if (!name || !rows || !columns) {
      setWarning("Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      const totalSeats = rows * columns;
      const seatMap = buildSeatMap(rows, columns);

      const newLayout = await createLayout({
        name,
        rows,
        columns,
        totalSeats,
        seatMap,
      });

      setMessage("Layout created successfully");
      console.log("New Layout:", newLayout);
    } catch (error) {
      setWarning("An error occurred while creating layout");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
  }, []);
  const buildSeatMap = (rows: number, columns: number): string[][] => {
    const seatMap: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < columns; j++) {
        const seatNumber = String.fromCharCode(65 + i) + (j + 1);
        row.push(seatNumber);
      }
      seatMap.push(row);
    }
    return seatMap;
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Layout operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Layout</h3>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block">Layout Name:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block">Number of Rows:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              value={rows}
              min={1}
              onChange={(e) => setRows(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block">Number of Columns:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              value={columns}
              min={1}
              onChange={(e) => setColumns(parseInt(e.target.value))}
            />
          </div>

          <div>Total seats: {rows * columns}</div>
          {warning && <div className="font-bold text-red-600">{warning}</div>}
          {message && <div className="font-bold text-green-600">{message}</div>}
          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
          </button>
        </form>
        <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
          <Link href="../operations/layout/layout-list">Check layout list</Link>
        </button>
        <Link href="../operations">
          <div className="focus:shadow-outline-blue mt-2 flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>

      <AdminSeatMap rows={rows} columns={columns} />
    </div>
  );
};

export default LayoutOperationsPage;
