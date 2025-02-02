"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if the user exists
    const user = users.find((user: { username: string; password: string }) =>
      user.username === username && user.password === password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // Save the username in localStorage so we can retrieve notes later
    localStorage.setItem("currentUser", username);

    // Create a token and store it in cookies
    const token = btoa(JSON.stringify({ username })); // Fake token for demo
    document.cookie = `token=${token}; path=/; max-age=3600;`; // 1-hour expiration

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <p className="mt-2">
        Don't have an account? <a href="/signup" className="text-blue-500">Sign up here</a>
      </p>
    </div>
  );
}
