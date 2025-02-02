"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [username, setUsername] = useState(""); // Logged-in user
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [dietaryRestriction, setDietaryRestriction] = useState("No Restrictions");
  const [goal, setGoal] = useState(""); // "Gain Weight" or "Lose Weight"
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [activityHistory, setActivityHistory] = useState("");
  const router = useRouter();

  // Cuisine options
  const cuisineOptions = [
    "Italian", "Mexican", "Indian", "Chinese", "Japanese", 
    "Mediterranean", "French", "Thai", "Korean", "American"
  ];

  useEffect(() => {
    // Get the logged-in user
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUsername(currentUser);

    // Load saved profile data
    const savedProfile = JSON.parse(localStorage.getItem(`profile_${currentUser}`) || "{}");
    if (savedProfile) {
      setHeight(savedProfile.height || "");
      setWeight(savedProfile.weight || "");
      setAge(savedProfile.age || "");
      setDietaryRestriction(savedProfile.dietaryRestriction || "No Restrictions");
      setGoal(savedProfile.goal || "");
      setCuisinePreferences(savedProfile.cuisinePreferences || []);
      setActivityHistory(savedProfile.activityHistory || "");
    }
  }, []);

  // Save profile when any field changes
  useEffect(() => {
    if (username) {
      localStorage.setItem(
        `profile_${username}`,
        JSON.stringify({ height, weight, age, dietaryRestriction, goal, cuisinePreferences, activityHistory })
      );
    }
  }, [height, weight, age, dietaryRestriction, goal, cuisinePreferences, activityHistory, username]);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      {/* Height Input */}
      <label className="block mb-2">Height (cm):</label>
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* Weight Input */}
      <label className="block mb-2">Weight (kg):</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* Age Input */}
      <label className="block mb-2">Age:</label>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* Dietary Restrictions Dropdown */}
      <label className="block mb-2">Dietary Restriction:</label>
      <select
        value={dietaryRestriction}
        onChange={(e) => setDietaryRestriction(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option>No Restrictions</option>
        <option>Vegetarian</option>
        <option>Nut-Free</option>
        <option>Vegan</option>
        <option>Gluten-Free</option>
        <option>Dairy-Free</option>
        <option>Keto-Friendly</option>
        <option>Low-Carb</option>
      </select>

      {/* Goal: Gain or Lose Weight */}
      <label className="block mb-2">Goal:</label>
      <div className="mb-4 flex space-x-4">
        <button
          className={`p-2 rounded-lg ${goal === "Gain Weight" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setGoal("Gain Weight")}
        >
          Gain Weight
        </button>
        <button
          className={`p-2 rounded-lg ${goal === "Lose Weight" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setGoal("Lose Weight")}
        >
          Lose Weight
        </button>
      </div>

      {/* Cuisine Preferences (Multi-Select) */}
      <label className="block mb-2">Cuisine Preferences (Select up to 3):</label>
      <select
        multiple
        value={cuisinePreferences}
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
          if (selectedOptions.length <= 3) {
            setCuisinePreferences(selectedOptions);
          }
        }}
        className="border p-2 w-full mb-4"
      >
        {cuisineOptions.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>

      {/* Success Message */}
      <p className="text-green-500">Profile data is automatically saved!</p>

      {/* Back to Dashboard */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
      >
        Back to Dashboard
      </button>
    </div>
  );
}