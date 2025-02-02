'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-purple-800 p-4">
      <div className="max-w-3xl mx-auto flex gap-4">
        <Link href="/" className="text-white hover:text-purple-200">
          Workout Planner
        </Link>
        <Link href="/diet" className="text-white hover:text-purple-200">
          Diet Planner
        </Link>
      </div>
    </nav>
  );
}