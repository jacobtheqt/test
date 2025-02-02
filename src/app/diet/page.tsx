'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function Diet() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [preferedCuisine, setPreferedCusines] = useState('');
  const [hasSubmittedPreferences, setHasSubmittedPreferences] = useState(false);

  // Options for dropdowns
  const dietaryOptions = [
    "No Restrictions",
    "Vegetarian",
    "Nut-Free",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto-Friendly",
    "Low-Carb"
  ];

  const cuisineOptions = [
    "French",
    "Thai",
    "Italian",
    "Indian",
    "Chinese",
    "Greek",
    "Spanish",
    "Mexican",
    "American"
  ]

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietaryRestrictions || !calorieGoal || !preferedCuisine) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: 'Generate my meal plan' }],
          dietaryRestrictions,
          calorieGoal,
          preferedCuisine
        }),
      });

      const data = await response.json();
      setMessages([data]);
      setHasSubmittedPreferences(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasSubmittedPreferences) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen p-4 max-w-3xl mx-auto bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4 text-purple-800">PCOS Meal Plan Generator</h1>
            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700">
                    Daily Calorie Goal
                  </label>
                  <input
                    type="number"
                    min="1200"
                    max="3000"
                    step="50"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="w-full p-2 border rounded-lg text-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-gray-700">
                    Dietary Restrictions/Preferences
                  </label>
                  <select
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-black"
                    required
                  >
                    <option value="">Select your dietary preference</option>
                    {dietaryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                <label className="block mb-2 text-gray-700">
                    Preferred Cuisine
                  </label>
                  <select
                    value={preferedCuisine}
                    onChange={(e) => setPreferedCusines(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-black"
                    required
                  >
                    <option value="">Select your Preferred Cuisine</option>
                    {cuisineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 rounded-lg disabled:bg-gray-300 text-black"
              >
                {isLoading ? 'Generating Plan...' : 'Generate Meal Plan'}
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-4 max-w-3xl mx-auto bg-white">
        <h1 className="text-2xl font-bold mb-4 text-purple-800">Your PCOS Meal Plan</h1>
        <div className="space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-white text-black border"
            >
              <p className="text-base whitespace-pre-line">{message.content}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setHasSubmittedPreferences(false);
            setMessages([]);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Generate New Plan
        </button>
      </main>
    </>
  );
}