import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Website</h1>
      <div className="space-x-4">
        <Link href="/user-section">
          <span className="text-blue-500 hover:text-blue-700 cursor-pointer">User Section</span>
        </Link>
        <Link href="/admin-section">
          <span className="text-blue-500 hover:text-blue-700 cursor-pointer">Admin Section</span>
        </Link>
      </div>
    </div>
  );
}
