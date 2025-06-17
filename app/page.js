'use client'
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {

  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      const registerUser = async () => {
        try {
          await fetch('/api/register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.fullName,
              email: user.primaryEmailAddress.emailAddress,
              image: user.imageUrl
            })
          });
        } catch (err) {
          console.error("Registration failed:", err);
        }
      };

      registerUser();
    }
  }, [isSignedIn, user]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">

        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            📘 <span>ExamWise</span>
          </h1>

          {isSignedIn ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={user.imageUrl}
                width={32}
                height={32}
                alt="Profile"
                className="rounded-full border border-black"
              />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="text-blue-600 font-medium hover:underline">Login</button>
            </SignInButton>
          )}
        </header>

        <section className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Practice Exams. Smarter Learning.</h2>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">Get personalized topic-wise feedback after each test to improve faster and smarter.</p>

          {isSignedIn ? (
            <Link href="/dashboard">
              <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                Go to Dashboard
              </span>
            </Link>
          ) : (
            <SignUpButton>
              <button className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                Get Started
              </button>
            </SignUpButton>
          )}

        </section>

        <section className="px-6 pb-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Choose a category to begin:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm">SSC</span>
            <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm">UPSC</span>
            <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm">Banking</span>
            <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm">Railways</span>
          </div>
        </section>

        <section className="px-4 pb-10 grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
          <div className="bg-white p-5 rounded-xl shadow-sm text-left">
            <h3 className="font-bold text-lg mb-1">💡 Smart Suggestions</h3>
            <p className="text-sm text-gray-600">We recommend topics you should focus on based on your test results.</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-left">
            <h3 className="font-bold text-lg mb-1">📚 Topic-wise Practice</h3>
            <p className="text-sm text-gray-600">Practice targeted questions in areas where you need the most improvement.</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-left">
            <h3 className="font-bold text-lg mb-1">📝 Real Exam Pattern</h3>
            <p className="text-sm text-gray-600">All questions follow real SSC, UPSC, and Banking exam formats.</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-left">
            <h3 className="font-bold text-lg mb-1">📈 Progress Tracking</h3>
            <p className="text-sm text-gray-600">Monitor your scores and track your growth after each test.</p>
          </div>
        </section>

        <footer className="bg-white border-t text-center text-sm text-gray-500 py-4 mt-auto">
          <p>&copy; 2025 ExamWise. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/about" className="text-blue-600 hover:underline">About</Link>
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy</Link>
            <Link href="/contact" className="text-blue-600 hover:underline">Contact</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
