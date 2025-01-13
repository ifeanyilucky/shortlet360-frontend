export default function ContactUs() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded"
                                placeholder="Your email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows="4"
                                placeholder="Your message"
                            ></textarea>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Send Message
                        </button>
                    </form>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                    <div className="space-y-4">
                        <p>
                            Have questions? We're here to help! Reach out to us through the form
                            or using the contact information below.
                        </p>
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <p>support@shortlet360.com</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Phone</h3>
                            <p>+234 123 456 7890</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 