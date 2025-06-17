'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Category = ({ userId }) => {
    const router = useRouter();
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            let res = await fetch('/api/categories');
            let json = await res.json()
            if (json.success) {
                setCategories(json.categories)
            }
        }
        fetchData()
    }, [])


    const handleCategorySelect = async (value) => {
        await fetch('/api/select-category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, category: value }),
        });

        router.refresh();
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="max-w-6xl mx-auto">

                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Choose Your Exam Category</h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">Select a topic to begin your personalized quiz.</p>


                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => handleCategorySelect(category.name)}
                                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition"
                            >
                                <div className="text-3xl mb-3 text-blue-600">{category.icon}</div>
                                <span className="text-sm font-semibold text-gray-800">{category.name}</span>
                            </button>
                        ))}

                    </div>
                </div>
            </div>

        </>
    )
}

export default Category