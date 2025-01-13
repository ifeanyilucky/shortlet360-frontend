export default function FAQ() {
    const faqs = [
        {
            question: "How does Shortlet360 work?",
            answer: "Shortlet360 connects property owners with guests looking for short-term accommodations. Browse listings, book your stay, and enjoy a seamless experience."
        },
        {
            question: "Is it safe to book through Shortlet360?",
            answer: "Yes, we implement strict security measures and verify all properties and users on our platform to ensure a safe booking experience."
        },
        // Add more FAQs as needed
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 