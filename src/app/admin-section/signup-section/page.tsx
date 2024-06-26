"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createAdmin, getAllAdmins } from "~/app/server-actions";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../../icons/show.png";
import hideLogo from "../../icons/hide.png";
import Link from "next/link";
const AdminSignupPage = () => {
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [warning, setWarning] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const specialSymbols = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "=",
    "}",
    "{",
    "|",
    "_",
    '"',
    "-",
    ";",
    ";",
    "<",
    ">",
    "/",
    "?",
    ".",
    ",",
    "'",
    "[",
    "]",
    "`",
  ];
  const checkPasswordValidity = () => {
    if (password.length < 8) {
      setWarning("Password too short. It must contain at least 8 characters.");
      return false;
    }
    let specialSymbolCounter = 0;
    let numberCounter = 0;
    let capitalLetterCounter = 0;

    for (const char of password) {
      if (specialSymbols.includes(char)) {
        specialSymbolCounter++;
      } else if (!isNaN(parseInt(char))) {
        numberCounter++;
      } else if (char.toUpperCase() === char) {
        capitalLetterCounter++;
      }
    }
    if (
      capitalLetterCounter < 1 ||
      numberCounter < 1 ||
      specialSymbolCounter < 1
    ) {
      setWarning(
        "Invalid password. It must contain at least 1 capital letter, 1 special character, and 1 number.",
      );
      return false;
    }
    return true;
  };
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (accessId === "" || password === "" || confirmPassword === "") {
        setWarning("Fill all fields");
        return;
      }
      const allAdmins = await getAllAdmins();
      if (!allAdmins) return;
      for (let i = 0; i < allAdmins.length; i++) {
        if (accessId === allAdmins[i]?.access_id) {
          setWarning("Account already created for this access ID");
          return;
        }
      }

      if (!checkPasswordValidity()) return;
      if (confirmPassword !== password) {
        setWarning("Password and confirm password should be identical");
        return;
      }
      setIsLoading(true);

      const newAdmin = await createAdmin({
        accessId,
        password,
      });
      console.log("New admin:", newAdmin.data);
      setWarning("");
      router.push("../admin-section/login-section");
    } catch (error) {
      setIsLoading(false);
      setWarning("Invalid input");
      console.log("Error:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold">SIGN UP</h1>
        <div className="flex">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Access ID
            </label>
            <input
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              className="w-full rounded border p-2 pr-36  focus:border-blue-500"
              placeholder="Enter your access ID"
            />
          </div>
        </div>
        <div className="flex">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 pr-36 focus:border-blue-500"
              type={isPasswordShown ? "text" : "password"}
              placeholder="Enter your password"
            />
          </div>

          <Image
            src={isPasswordShown ? showLogo.src : hideLogo.src}
            onClick={() => setIsPasswordShown(!isPasswordShown)}
            width="20"
            height="25"
            alt="Show password"
            className="absolute ml-80 mt-9 max-h-8 max-w-8 hover:scale-110"
          ></Image>
        </div>
        <div className="flex">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 pr-36  focus:border-blue-500"
              type={isConfirmPasswordShown ? "text" : "password"}
              placeholder="Confirm your password"
            />
          </div>
          <Image
            src={isConfirmPasswordShown ? showLogo.src : hideLogo.src}
            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
            width="20"
            height="25"
            alt="Show confirm password"
            className="absolute ml-80 mt-9 max-h-8 max-w-8 hover:scale-110"
          ></Image>
        </div>
        <div className="font-bold text-red-600">{warning}</div>
        <div className="flex justify-between">
          <Link href="../admin-section">
            <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
              Back
            </div>
          </Link>
          <button
            onClick={async (e) => await handleSignup(e)}
            className="text-blue-500 hover:text-blue-600"
          >
            {!isLoading && <div>Sign up</div>}
            {isLoading && <ClipLoader color="blue" size={20}></ClipLoader>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
