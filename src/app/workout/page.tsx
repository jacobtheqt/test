'use client';

import { useState } from 'react';
// Your existing workout code, but change:
import Navigation from '../components/Navigation'; 


export default function Workout() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [timePerDay, setTimePerDay] = useState('');
  const [exersizeConstraints, setExersizeConstraints] = useState('');
  const [hasSubmittedPreferences, setHasSubmittedPreferences] = useState(false);

  // Options for the dropdown
  const constraintOptions = [
    "Gym Access (Full Equipment)",
    "Home Gym (Basic Equipment)",
    "Dumbbells Only",
    "Bodyweight Only",
    "Resistance Bands Only",
    "Minimal Equipment (Bands & Dumbbells)",
  ];

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!daysPerWeek || !timePerDay || !exersizeConstraints) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: 'Generate my workout plan' }],
          daysPerWeek,
          timePerDay,
          exersizeConstraints
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

  if (!hasSubmittedPreferences) { // THIS IS FOR WORKOUT
    return (
      <>
        <Navigation />
        <main className="min-h-screen p-4 max-w-3xl mx-auto bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4 text-purple-800">PCOS Workout Plan Generator</h1>
            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700">
                    How many times per week would you like to work out?
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-gray-700">
                    How many minutes per day would you like to work out?
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={timePerDay}
                    onChange={(e) => setTimePerDay(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">
                    What equipment do you have available?
                  </label>
                  <select
                    value={exersizeConstraints}
                    onChange={(e) => setExersizeConstraints(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                    required
                  >
                    <option value="">Select your equipment</option>
                    {constraintOptions.map((option) => (
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300"
              >
                {isLoading ? 'Generating Plan...' : 'Generate Workout Plan'}
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
        <h1 className="text-2xl font-bold mb-4 text-purple-800">Your PCOS Workout Plan</h1>
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