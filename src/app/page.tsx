'use client';

import Navigation from './components/Navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-4 max-w-3xl mx-auto bg-white">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          PCOS Health Management
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/workout" 
                className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              Workout Planner
            </h2>
            <p className="text-gray-600">
              Generate personalized PCOS-friendly workout plans based on your equipment and schedule.
            </p>
          </Link>

          <Link href="/diet" 
                className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              Meal Planner
            </h2>
            <p className="text-gray-600">
              Create customized meal plans that help manage PCOS symptoms and maintain healthy insulin levels.
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            About PCOS Management
          </h2>
          <p className="text-gray-700 mb-4">
            PCOS (Polycystic Ovary Syndrome) management involves a combination of regular exercise 
            and proper nutrition. Our tools help you create personalized plans that take into 
            account your specific needs and preferences.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Exercise helps improve insulin sensitivity</li>
            <li>Proper nutrition supports hormone balance</li>
            <li>Consistent routines lead to better results</li>
            <li>Personalized plans increase adherence</li>
          </ul>
        </div>
      </main>
    </>
  );
}