"use client";
import React, { useState } from "react";
import { createUser } from "~/app/server-actions";

const UserOperationsPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!email || email === "" || !password || password === "") {
        return;
      }
      const newUser = await createUser({
        newUserId: "user0",
        email,
        password,
        isAdmin: false,
      });
      console.log("New user:", newUser.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">User operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create User</h3>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            await handleCreateUser(e);
          }}
        >
          <div>
            <label className="mb-1 block">Email:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block">Password:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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

export default UserOperationsPage;
