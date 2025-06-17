'use client'
import React from 'react'
import Link from 'next/link'
import { SignOutButton } from "@clerk/nextjs";

const DashboardClient = ({ name, category, correctAnswers, totalQuestions, accuracy, testTaken, focusTopics }) => {

    return (
        <>
            <div className="bg-gray-100 min-h-screen text-gray-800">

                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">ExamWise</Link>
                    <SignOutButton>
                        <button className="text-sm text-red-500 hover:underline">Logout</button>
                    </SignOutButton>
                </header>

                <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Welcome, {name.split(" ")[0]}</h2>
                        <p className="text-gray-500 mt-1">
                            Selected Category: <span className="text-blue-600 font-semibold">{category.toUpperCase()}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow text-center">
                            <p className="text-sm text-gray-500">Tests Taken</p>
                            <h3 className="text-xl font-bold text-gray-800">{testTaken}</h3>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow text-center">
                            <p className="text-sm text-gray-500">Correct Answers</p>
                            <h3 className="text-xl font-bold text-gray-800">{correctAnswers}/{totalQuestions}</h3>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow text-center">
                            <p className="text-sm text-gray-500">Accuracy</p>
                            <h3 className="text-xl font-bold text-blue-600">{accuracy}%</h3>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow text-center">
                            <p className="text-sm text-gray-500">Focus Topics</p>
                            <h3 className="text-xl font-bold text-gray-800">{focusTopics.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h3 className="text-lg font-semibold mb-3">📌 Topics You Should Focus On</h3>
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                            {focusTopics.length > 0 ? (
                                focusTopics.map((topic) => <li key={topic}>{topic}</li>)
                            ) : (
                                <li>Great job! You performed well in all topics.</li>
                            )}
                        </ul>
                    </div>

                    <div className="text-center">
                        <Link href={`/mcq?category=${category}`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                            Start New Test
                        </Link>
                    </div>

                </main>

                <footer className="text-center text-sm text-gray-500 py-4">
                    © 2025 ExamWise. All rights reserved.
                </footer>

            </div>

        </>
    )
}

export default DashboardClient