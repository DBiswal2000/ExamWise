'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ResultClient = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await fetch('/api/result');
                const data = await res.json();
                if (data.success && data.result) {
                    setResult(data.result);
                }
            } catch (err) {
                console.error('Failed to fetch result:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!result) return <p className="text-center mt-10 text-red-500">No result found.</p>;

    const {
        category = '',
        correct = 0,
        wrong = 0,
        total = 0,
        analysis = [],
        focusTopics = [],
        submittedAt,
    } = result;

    const scorePercent = Math.round((correct / total) * 100);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">ExamWise</h1>
                <Link href="/dashboard" className="text-sm text-blue-600 font-medium hover:underline">
                    Dashboard
                </Link>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">🎉 Well done!</h2>
                    <p className="text-gray-500 mt-1">
                        You completed the <span className="text-blue-600 font-semibold">{category}</span> test.
                    </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow text-center">
                        <p className="text-sm text-gray-500">Correct Answers</p>
                        <h3 className="text-xl font-bold text-green-600">{correct}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow text-center">
                        <p className="text-sm text-gray-500">Wrong Answers</p>
                        <h3 className="text-xl font-bold text-red-500">{wrong}</h3>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow text-center">
                        <p className="text-sm text-gray-500">Final Score</p>
                        <h3 className="text-xl font-bold text-blue-600">{scorePercent}%</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                    <h3 className="text-lg font-semibold">📊 Topic-wise Analysis</h3>
                    {analysis.length ? (
                        analysis.map(({ topic, correct, total }) => {
                            const percent = Math.round((correct / total) * 100);
                            return (
                                <div key={topic}>
                                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                                        <span>{topic}</span>
                                        <span>
                                            {correct}/{total}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-blue-500 rounded-full"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-gray-500">No topic-wise data available.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-3">📌 Topics to Focus On</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {focusTopics.length ? (
                            focusTopics.map((t) => <li key={t}>{t}</li>)
                        ) : (
                            <li>Great job! You performed well in all topics.</li>
                        )}
                    </ul>
                </div>

                {category && (
                    <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/mcq?category=${category.toLowerCase()}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                        >
                            Retake Test
                        </Link>
                        <Link
                            href="/dashboard"
                            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t text-center text-sm text-gray-500 py-4 mt-6">
                &copy; 2025 ExamWise — Smarter Practice. Better Results.
            </footer>
        </div>
    );
};

export default ResultClient;
