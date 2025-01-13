export default function Blog() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Blog</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Add blog posts here */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <img
                        src="https://via.placeholder.com/400x250"
                        alt="Blog post"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Top 10 Short-term Rental Tips
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Essential tips for making the most of your short-term rental experience...
                        </p>
                        <button className="text-blue-600 hover:underline">Read more</button>
                    </div>
                </div>
            </div>
        </div>
    );
} 