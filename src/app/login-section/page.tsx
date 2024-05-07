"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../icons/show.png";
import hideLogo from "../icons/hide.png";
import { useUserContext } from "~/app/context";
import { getAllUsers } from "~/app/server-actions";
const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const handleLogin = async () => {
    try {
      if (email === "" || password === "") {
        setWarning("Fill all fields");
        return;
      }
      setIsLoading(true);
      const allUsers = await getAllUsers();
      for (let i = 0; i < allUsers.length; i++) {
        if (email === allUsers[i]?.email) {
          if (password === allUsers[i]?.password) {
            context.setCurrentUser(allUsers[i].id);
            localStorage.setItem("userId", allUsers[i].id);
            setWarning("");
            setEmail("");
            setPassword("");
            router.push("../mainpage");
            break;
          } else {
            setWarning("Wrong password");
          }
        } else {
          setWarning("Email not found");
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setWarning("Something went wrong");
      console.log("An error occured while logging in:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mt-10 w-96 rounded bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Login
        </h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 p-2  focus:border-blue-500"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex">
            <div>
              <label className="mb-2 text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 pr-14  focus:border-blue-500"
                type={isPasswordShown ? "text" : "password"}
                placeholder="Enter your password"
              />
            </div>

            <Image
              src={isPasswordShown ? showLogo.src : hideLogo.src}
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              width="20"
              height="24"
              alt="Show password"
              className="absolute ml-72 mt-9 max-h-8 max-w-8 hover:scale-110"
            ></Image>
          </div>
          <div className="font-bold text-red-600">{warning}</div>
          <button
            className=" focus:shadow-outline-blue w-full rounded bg-blue-500 p-2 text-center text-white hover:bg-blue-600 focus:outline-none"
            onClick={async () => await handleLogin()}
            disabled={isLoading}
          >
            {!isLoading && <div>Login</div>}
            {isLoading && <ClipLoader color="white" size={20}></ClipLoader>}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-600">No account?</span>
          <Link
            href="../signup-section"
            className="ml-1 text-blue-500 hover:text-blue-600"
          >
            Sign up
          </Link>
        </div>
        <Link href="/">
          <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
