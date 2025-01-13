export default function About() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">About Shortlet360</h1>
            <div className="prose max-w-none">
                <p className="text-lg mb-4">
                    Shortlet360 is your premier destination for finding and booking quality short-term accommodations.
                    We connect property owners with travelers seeking comfortable, convenient, and reliable short-term stays.
                </p>
                <div className="grid md:grid-cols-2 gap-8 my-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p>
                            To revolutionize the short-term rental market by providing a seamless,
                            transparent, and reliable platform for both property owners and guests.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                        <p>
                            To become the most trusted and preferred platform for short-term
                            accommodations across Africa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 