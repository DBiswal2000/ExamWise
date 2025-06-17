'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const MCQClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get('category')?.toLowerCase();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timings, setTimings] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showResult, setShowResult] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            const res = await fetch(`/api/questions?category=${category}`);
            const json = await res.json();
            if (json.success) {
                setQuestions(json.questions);
                setTimings(new Array(json.questions.length).fill({ entry: null, exit: null }));
            }
        };
        if (category) fetchQuestions();
    }, [category]);

    useEffect(() => {
        if (!questions.length || showResult) return;

        setTimings((prev) =>
            prev.map((entry, i) =>
                i === currentIndex ? { ...entry, entry: new Date().toISOString() } : entry
            )
        );

        setTimeLeft(30);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 1) {
                    clearInterval(timerRef.current);
                    handleNext(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex, questions, showResult]);

    const currentQuestion = questions[currentIndex];

    const handleOptionChange = (optionKey) => {
        setAnswers((prev) => ({ ...prev, [currentIndex]: optionKey }));
    };

    const handleNext = (isTimeout = false) => {
        clearInterval(timerRef.current);

        setTimings((prev) =>
            prev.map((entry, i) =>
                i === currentIndex ? { ...entry, exit: new Date().toISOString() } : entry
            )
        );

        const isLastQuestion = currentIndex === questions.length - 1;

        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const calculateScore = () => {
        return questions.reduce((score, q, i) => {
            return answers[i] && answers[i] === q.correctAnswer ? score + 1 : score;
        }, 0);
    };

    const getTopicWiseStats = () => {
        const topicStats = {};

        questions.forEach((q, i) => {
            const topic = q.topic;
            if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0 };
            }
            topicStats[topic].total += 1;
            if (answers[i] && answers[i] === q.correctAnswer) {
                topicStats[topic].correct += 1;
            }
        });

        return topicStats;
    };

    useEffect(() => {
        if (showResult) {
            const total = questions.length;
            const correct = calculateScore();
            const wrong = total - correct;
            const topicStats = getTopicWiseStats();

            const analysis = Object.entries(topicStats).map(([topic, stat]) => ({
                topic,
                correct: stat.correct,
                total: stat.total
            }));

            const focusTopics = Object.entries(topicStats)
                .filter(([_, stat]) => stat.correct / stat.total < 0.6)
                .map(([topic]) => topic);

            const result = {
                category: category?.toUpperCase(),
                correct,
                wrong,
                total,
                analysis,
                focusTopics,
                submittedAt: new Date().toISOString()
            };

            const sendResult = async () => {
                try {
                    const res = await fetch('/api/result', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result)
                    });

                    const data = await res.json();
                    if (data.success) {
                        router.push('/result');
                    } else {
                        console.error('Failed to save result:', data.message);
                    }
                } catch (error) {
                    console.error('Error sending result:', error);
                }
            };

            sendResult();
        }
    }, [showResult]);


    if (!currentQuestion && !showResult) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">ExamWise</h1>
                <div className="flex items-center gap-4">
                    {!showResult && (
                        <span className="text-sm text-red-600 font-medium">Time Left: {timeLeft}s</span>
                    )}
                    <span className="text-gray-600 text-sm">
                        Topic: <strong>{category?.toUpperCase()}</strong>
                    </span>
                </div>
            </header>

            <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-6">
                <div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-right mt-1">
                        Question {currentIndex + 1} of {questions.length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {currentQuestion?.questionText}
                    </h2>

                    <div className="space-y-3">
                        {["A", "B", "C", "D"].map((key) => {
                            const optText = currentQuestion[`option${key}`];
                            return (
                                <label
                                    key={key}
                                    className={`block p-3 rounded-xl cursor-pointer transition ${answers[currentIndex] === key
                                        ? 'bg-blue-100 border border-blue-600'
                                        : 'bg-gray-100 hover:bg-blue-100'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentIndex}`}
                                        value={key}
                                        className="hidden"
                                        checked={answers[currentIndex] === key}
                                        onChange={() => handleOptionChange(key)}
                                    />
                                    <span className="text-gray-700">
                                        {key}. {optText}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                        onClick={() => handleNext(false)}
                    >
                        {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
                    </button>
                </div>
            </main>

            <footer className="bg-white border-t text-center text-sm text-gray-500 py-4">
                &copy; 2025 ExamWise — Smarter Practice. Better Results.
            </footer>
        </div>
    );
};

export default MCQClient;
