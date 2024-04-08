import Link from 'next/link'
import React from 'react'

const UserMainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">USER MAIN PAGE</h1>
      <div className="flex flex-col gap-4">
        <Link href="../user-section/login-section">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Login
          </button>
        </Link>
        <Link href="../user-section/signup-section">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  )
}

export default UserMainPage



