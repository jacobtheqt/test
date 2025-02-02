"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInput, setUserInput] = useState(""); // Stores user notes
  const [username, setUsername] = useState(""); // Stores logged-in user
  const router = useRouter();

  useEffect(() => {
    // Get token from cookies
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
      router.push("/login"); // Redirect if not logged in
    } else {
      setAuthenticated(true);
      try {
        const decoded = JSON.parse(atob(token)); // Decode token (since we used btoa)
        setUsername(decoded.username);

        // Save the current user in localStorage
        localStorage.setItem("currentUser", decoded.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Load saved notes when username is set
  useEffect(() => {
    const savedUsername = localStorage.getItem("currentUser");
    if (savedUsername) {
      setUsername(savedUsername);
      const savedNotes = localStorage.getItem(`notes_${savedUsername}`);
      if (savedNotes !== null) {
        setUserInput(savedNotes);
      }
    }
  }, []);

  // Save user notes in localStorage whenever they change
  useEffect(() => {
    if (username) {
      localStorage.setItem(`notes_${username}`, userInput);
    }
  }, [userInput, username]);

  return authenticated ? (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {username}!</h1>

      {/* User Notes Input */}
      <div className="mt-4">
        <label className="block text-lg font-semibold">Your Notes:</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type something here..."
          className="border p-2 w-full h-32"
        />
      </div>

      {/* Buttons */}
      <div className="mt-4 flex space-x-4">
        {/* User Profile Button */}
        <button
          onClick={() => router.push("/profile")}
          className="bg-green-500 text-white p-2 rounded-lg"
        >
          Go to Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear token
            localStorage.removeItem("currentUser"); // Remove saved username
            router.push("/login");
          }}
          className="bg-red-500 text-white p-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  ) : null;
}