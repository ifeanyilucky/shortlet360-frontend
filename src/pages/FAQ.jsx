import { useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiShield,
  FiUsers,
  FiCalendar,
  FiInfo,
} from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { Link } from "react-router-dom";
import InteractiveButton from "../components/InteractiveButton";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // FAQ categories with icons
  const categories = [
    { id: "general", name: "General", icon: <FiInfo /> },
    { id: "apartments", name: "Apartment Rentals", icon: <MdApartment /> },
    { id: "shortlets", name: "Short-term Stays", icon: <FiHome /> },
    { id: "payment", name: "Payment Options", icon: <FiDollarSign /> },
    { id: "booking", name: "Booking Process", icon: <FiCalendar /> },
    { id: "security", name: "Security & Privacy", icon: <FiShield /> },
  ];

  // Comprehensive FAQ list organized by categories
  const faqsByCategory = {
    general: [
      {
        question: "What is Shortlet360?",
        answer:
          "Shortlet360 is a premier platform for finding and renting quality apartments across Nigeria. We offer both long-term apartment rentals and short-term accommodations with flexible payment options and hassle-free management.",
      },
      {
        question: "How does Shortlet360 work?",
        answer:
          "Shortlet360 connects property owners with individuals looking for quality accommodations. You can browse our listings, filter by your preferences, select a property, choose your preferred payment option, and complete the booking process. Our team will guide you through the rest of the process.",
      },
      {
        question: "What areas do you cover?",
        answer:
          "We currently operate in major cities across Nigeria, including Lagos, Abuja, Port Harcourt, and more. We're continuously expanding to new locations to serve more customers.",
      },
      {
        question: "How do I contact customer support?",
        answer:
          "You can reach our customer support team through multiple channels: email at support@shortlet360.com, phone at +234 123 456 7890, or through the contact form on our Contact Us page. Our support team is available Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 3:00 PM.",
      },
    ],
    apartments: [
      {
        question: "What types of apartments do you offer?",
        answer:
          "We offer a wide range of apartments including studio apartments, one-bedroom, two-bedroom, and three-bedroom apartments, as well as luxury penthouses and serviced apartments. All our listings are carefully vetted to ensure they meet our quality standards.",
      },
      {
        question: "What amenities are included in the apartments?",
        answer:
          "Our apartments come with various amenities depending on the property, but most include essentials like 24/7 power supply, treated water, waste management, and facility maintenance. Many properties also offer additional amenities such as swimming pools, gyms, security, and more. Each listing details the specific amenities available.",
      },
      {
        question: "What is the minimum rental period for apartments?",
        answer:
          "For long-term apartment rentals, the minimum period is typically 6 months, but this can vary depending on the property. Some property owners may offer more flexible terms. For specific information, please check the individual property listings or contact our support team.",
      },
      {
        question: "Can I rent an apartment if I'm not a Nigerian citizen?",
        answer:
          "Yes, we welcome international clients. However, additional documentation may be required for verification purposes. Please contact our support team for specific requirements for non-Nigerian citizens.",
      },
    ],
    shortlets: [
      {
        question: "What is a shortlet?",
        answer:
          "A shortlet is a short-term accommodation rental, typically ranging from a few days to a few weeks. Our shortlets are fully furnished and equipped with all the essentials you need for a comfortable stay.",
      },
      {
        question: "Do you offer short-term stays?",
        answer:
          "Yes, while we focus primarily on apartment rentals, we also offer short-term accommodations for those needing temporary housing solutions. These are perfect for business travelers, tourists, or anyone needing a temporary place to stay.",
      },
      {
        question: "What is included in a shortlet booking?",
        answer:
          "Our shortlet bookings typically include all utilities (electricity, water, internet), basic toiletries, kitchen essentials, and linens. Many properties also offer additional services like cleaning, laundry, and 24/7 customer support.",
      },
      {
        question: "Can I extend my shortlet stay if needed?",
        answer:
          "Yes, you can extend your stay subject to availability. We recommend notifying us at least 48 hours before your scheduled check-out date to ensure the property remains available.",
      },
    ],
    payment: [
      {
        question: "What payment options are available?",
        answer:
          "We offer two monthly payment options for apartment rentals: Option 1 with 2% monthly interest on rent (upfront fees) or Option 2 with 3% monthly interest (all costs divided into monthly payments). For shortlets, payment is typically made in full at the time of booking.",
      },
      {
        question: "Can you explain the two monthly payment options in detail?",
        answer:
          "Option 1 (2% monthly interest): You pay all upfront fees (agency fee, legal fee, caution fee) at the beginning, and then pay monthly rent with a 2% interest rate. Option 2 (3% monthly interest): All costs, including rent and fees, are divided into monthly payments with a 3% interest rate. This option requires no large upfront payment.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods including credit/debit cards, bank transfers, and mobile payment solutions. All payments are processed securely through our platform.",
      },
      {
        question: "Is there a security deposit required?",
        answer:
          "Yes, most properties require a security deposit, which is refundable at the end of your stay, subject to the condition of the property. The specific amount varies by property and is clearly indicated on each listing.",
      },
      {
        question: "When is rent due each month?",
        answer:
          "For monthly rentals, payment is typically due on the same day each month as your move-in date. You'll receive reminders before the due date, and can set up automatic payments for convenience.",
      },
    ],
    booking: [
      {
        question: "How do I book an apartment?",
        answer:
          "To book an apartment, browse our listings, select the property you're interested in, choose your preferred payment option, and complete the booking process online. Our team will then contact you to finalize the details and arrange for move-in.",
      },
      {
        question: "How long is the rental process?",
        answer:
          "Our streamlined process typically takes just 4 minutes to complete a booking. Move-in can be arranged as quickly as 24-48 hours after approval, depending on the property's availability and your specific requirements.",
      },
      {
        question: "Can I cancel my booking?",
        answer:
          "Yes, cancellation policies vary depending on the property and the type of booking (shortlet vs. long-term rental). Please refer to the specific cancellation policy for each property, which is clearly stated on the listing page.",
      },
      {
        question: "What documents do I need to book an apartment?",
        answer:
          "Typically, you'll need a valid ID (National ID, driver's license, or international passport), proof of income or employment, and sometimes references. Specific requirements may vary depending on the property and the length of stay.",
      },
    ],
    security: [
      {
        question: "Is it safe to book through Shortlet360?",
        answer:
          "Yes, we implement strict security measures and verify all properties and users on our platform to ensure a safe booking experience. Our secure payment system protects your financial information, and we have a verification process for all property listings.",
      },
      {
        question: "How do you verify properties?",
        answer:
          "All properties listed on our platform undergo a thorough verification process. Our team physically inspects each property to ensure it meets our quality standards, verifies ownership documents, and checks that all amenities listed are actually available.",
      },
      {
        question: "What happens if there's an issue with my booking?",
        answer:
          "If you encounter any issues with your booking, our customer support team is available to assist. We have a dispute resolution process in place and will work with both you and the property owner to find a satisfactory solution.",
      },
      {
        question: "How is my personal information protected?",
        answer:
          "We take data privacy seriously and comply with relevant data protection regulations. Your personal information is encrypted and securely stored. We do not share your information with third parties without your consent, except as required to facilitate your booking.",
      },
    ],
  };

  // Toggle question expansion
  const toggleQuestion = (categoryId, index) => {
    setExpandedQuestions((prev) => {
      const key = `${categoryId}-${index}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  // Filter FAQs based on search query
  const filterFAQs = () => {
    if (!searchQuery.trim()) {
      return faqsByCategory;
    }

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.keys(faqsByCategory).forEach((category) => {
      filtered[category] = faqsByCategory[category].filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    });

    return filtered;
  };

  const filteredFAQs = filterFAQs();

  // Check if any FAQs match the search query
  const hasResults = Object.values(filteredFAQs).some(
    (category) => category.length > 0
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Find answers to common questions about our apartment rentals and
            services.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-primary-500 transition-colors">
              <div className="pl-4">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full py-3 px-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories and Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Search Results Message */}
          {searchQuery && (
            <div className="text-center mb-8">
              {hasResults ? (
                <p className="text-gray-600">
                  Showing results for "{searchQuery}"
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-gray-500">
                    Try a different search term or browse by category
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            {/* Show all categories that match search, or just the active category if no search */}
            {searchQuery ? (
              Object.keys(filteredFAQs).map(
                (categoryId) =>
                  filteredFAQs[categoryId].length > 0 && (
                    <div key={categoryId} className="mb-8">
                      <h2 className="text-2xl font-bold mb-4 flex items-center">
                        {categories.find((c) => c.id === categoryId).icon}
                        <span className="ml-2">
                          {categories.find((c) => c.id === categoryId).name}
                        </span>
                      </h2>
                      <div className="space-y-4">
                        {filteredFAQs[categoryId].map((faq, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                          >
                            <button
                              className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                              onClick={() => toggleQuestion(categoryId, index)}
                            >
                              <h3 className="text-lg font-semibold pr-8">
                                {faq.question}
                              </h3>
                              {expandedQuestions[`${categoryId}-${index}`] ? (
                                <FiChevronUp className="flex-shrink-0 text-primary-500" />
                              ) : (
                                <FiChevronDown className="flex-shrink-0 text-primary-500" />
                              )}
                            </button>
                            {expandedQuestions[`${categoryId}-${index}`] && (
                              <div className="px-6 pb-6">
                                <div className="w-full h-px bg-gray-200 mb-4"></div>
                                <p className="text-gray-600">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )
            ) : (
              <div className="space-y-4">
                {filteredFAQs[activeCategory]?.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <button
                      className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                      onClick={() => toggleQuestion(activeCategory, index)}
                    >
                      <h3 className="text-lg font-semibold pr-8">
                        {faq.question}
                      </h3>
                      {expandedQuestions[`${activeCategory}-${index}`] ? (
                        <FiChevronUp className="flex-shrink-0 text-primary-500" />
                      ) : (
                        <FiChevronDown className="flex-shrink-0 text-primary-500" />
                      )}
                    </button>
                    {expandedQuestions[`${activeCategory}-${index}`] && (
                      <div className="px-6 pb-6">
                        <div className="w-full h-px bg-gray-200 mb-4"></div>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            If you couldn't find the answer to your question, our support team
            is here to help. Contact us and we'll get back to you as soon as
            possible.
          </p>
          <Link to="/contact">
            <InteractiveButton>Contact Support</InteractiveButton>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Apartment?
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-primary-100">
            Browse our selection of quality apartments with flexible payment
            options designed to suit your needs.
          </p>
          <Link to="/book-now">
            <button className="bg-white text-primary-500 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors">
              Browse Apartments
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
