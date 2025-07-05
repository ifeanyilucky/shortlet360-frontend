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
  FiStar,
  FiCheck,
  FiTool,
  FiShoppingBag,
} from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { MdApartment, MdBusiness } from "react-icons/md";
import { Link } from "react-router-dom";
import InteractiveButton from "../components/InteractiveButton";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // FAQ categories with icons
  const categories = [
    { id: "general", name: "General", icon: <FiInfo /> },
    { id: "properties", name: "Properties", icon: <FiHome /> },
    { id: "shortlets", name: "Shortlets", icon: <MdApartment /> },
    { id: "offices", name: "Office Spaces", icon: <MdBusiness /> },
    { id: "payment", name: "Payment & Pricing", icon: <FiDollarSign /> },
    { id: "booking", name: "Booking Process", icon: <FiCalendar /> },
    { id: "apletfix", name: "ApletFix Services", icon: <FiTool /> },
    { id: "referral", name: "Referral Program", icon: <FiUsers /> },
    { id: "marketplace", name: "Marketplace", icon: <FiShoppingBag /> },
    { id: "management", name: "Property Management", icon: <BiBuildings /> },
    { id: "security", name: "Security & Privacy", icon: <FiShield /> },
  ];

  // Comprehensive FAQ list organized by categories
  const faqsByCategory = {
    general: [
      {
        question: "What is Aplet360?",
        answer:
          "Aplet360 is a comprehensive real estate platform in Nigeria offering apartment rentals, home maintenance services (ApletFix), and property management solutions. We connect property owners with tenants and provide value-added services to make housing accessible and convenient.",
      },
      {
        question: "How does Aplet360 work?",
        answer:
          "Aplet360 operates as a multi-service platform: 1) Browse and book apartments, shortlets, 2) Access ApletFix for home maintenance services, 3) Use our referral program to earn rewards, 4) Access our marketplace for home essentials, and 5) Get professional property management services. Our streamlined process takes just 4 minutes to complete a booking.",
      },
      {
        question: "What areas do you cover?",
        answer:
          "We currently operate in major cities across Nigeria, including Lagos, Abuja, Port Harcourt, and more. We're continuously expanding to new locations to serve more customers across the country.",
      },
      {
        question: "How do I contact customer support?",
        answer:
          "You can reach our customer support team through multiple channels: email at support@aplet360.com, phone at 09122842288, or through the contact form on our Contact Us page. Our support team is available Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 3:00 PM. You can also visit our office at 38, Opebi Road, Adebola House, Ikeja Lagos.",
      },
    ],
    properties: [
      {
        question: "What types of rental properties do you offer?",
        answer:
          "We offer a wide range of rental properties including studio apartments, one-bedroom, two-bedroom, and three-bedroom apartments, as well as luxury penthouses and serviced apartments. All our listings are carefully vetted to ensure they meet our quality standards and include essential amenities.",
      },
      {
        question: "What amenities are included in rental apartments?",
        answer:
          "Our rental apartments come with various amenities depending on the property, but most include essentials like 24/7 power supply, treated water, waste management, and facility maintenance. Many properties also offer additional amenities such as swimming pools, gyms, security, and more. Each listing details the specific amenities available.",
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
      {
        question: "How do you verify rental properties?",
        answer:
          "All properties listed on our platform undergo a thorough verification process. Our team physically inspects each property to ensure it meets our quality standards, verifies ownership documents, and checks that all amenities listed are actually available. This protects you from scams and ensures you're dealing with legitimate property owners.",
      },
    ],
    shortlets: [
      {
        question: "What is a shortlet?",
        answer:
          "A shortlet is a short-term accommodation rental, typically ranging from a few days to a few weeks. Our shortlets are fully furnished and equipped with all the essentials you need for a comfortable stay, perfect for business travelers, tourists, or anyone needing temporary housing solutions.",
      },
      {
        question: "What pricing options are available for shortlets?",
        answer:
          "Our shortlets offer flexible pricing options including daily, weekly, and monthly rates. Each pricing option includes the base price plus cleaning fees and security deposits. You can choose the option that best fits your stay duration and budget.",
      },
      {
        question: "What is included in a shortlet booking?",
        answer:
          "Our shortlet bookings typically include all utilities (electricity, water, internet), basic toiletries, kitchen essentials, and linens. Many properties also offer additional services like cleaning, laundry, and 24/7 customer support. Each listing details what's included.",
      },
      {
        question: "Can I extend my shortlet stay if needed?",
        answer:
          "Yes, you can extend your stay subject to availability. We recommend notifying us at least 48 hours before your scheduled check-out date to ensure the property remains available and to arrange for any necessary adjustments.",
      },
      {
        question: "How far in advance should I book a shortlet?",
        answer:
          "We recommend booking at least 1-2 weeks in advance for popular locations and peak seasons. However, we also accommodate last-minute bookings subject to availability. Booking early ensures you get your preferred dates and property.",
      },
    ],
    offices: [
      {
        question: "Do you offer office spaces for rent?",
        answer:
          "Yes, we offer office spaces for both short-term and long-term rentals. Our office spaces are suitable for startups, small businesses, and corporate clients looking for flexible workspace solutions.",
      },
      {
        question: "What types of office spaces are available?",
        answer:
          "We offer various office space options including private offices, co-working spaces, meeting rooms, and fully serviced office suites. Each space comes with essential business amenities and flexible lease terms.",
      },
      {
        question: "What amenities are included with office rentals?",
        answer:
          "Our office spaces typically include high-speed internet, utilities, cleaning services, security, and access to common areas. Many locations also offer additional amenities like meeting rooms, printing services, and kitchen facilities.",
      },
      {
        question: "Can I rent an office space for just a few days?",
        answer:
          "Yes, we offer flexible office rental options including daily, weekly, and monthly rates. This is perfect for temporary projects, client meetings, or businesses that need occasional office space.",
      },
    ],
    payment: [
      {
        question: "What payment options are available?",
        answer:
          "We accept various payment methods including credit/debit cards, bank transfers, and mobile payment solutions. For rentals, we offer flexible payment terms. For shortlets, payment is typically made in full at the time of booking. All payments are processed securely through our platform.",
      },
      {
        question: "Do you offer monthly payment plans for rentals?",
        answer:
          "Yes, we're partnering with leading financial institutions to offer flexible monthly payment solutions for apartment rentals. These plans are designed to make quality housing accessible by allowing you to spread rental costs over time instead of paying large upfront amounts.",
      },
      {
        question: "What fees are included in the pricing?",
        answer:
          "For rentals, fees may include agency fees, commission fees, caution fees, and legal fees depending on the property and payment plan. For shortlets, fees include cleaning fees and security deposits. All fees are clearly detailed on each property listing.",
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
        question: "How do I book a property?",
        answer:
          "To book a property, browse our listings, select the property you're interested in, choose your preferred dates and pricing option, and complete the booking process online. Our team will then contact you to finalize the details and arrange for move-in.",
      },
      {
        question: "How long does the booking process take?",
        answer:
          "Our streamlined process typically takes just 4 minutes to complete a booking. Move-in can be arranged as quickly as 24-48 hours after approval, depending on the property's availability and your specific requirements.",
      },
      {
        question: "Can I cancel my booking?",
        answer:
          "Yes, cancellation policies vary depending on the property and the type of booking (shortlet vs. long-term rental). Please refer to the specific cancellation policy for each property, which is clearly stated on the listing page.",
      },
      {
        question: "What documents do I need to book a property?",
        answer:
          "Typically, you'll need a valid ID (National ID, driver's license, or international passport), proof of income or employment, and sometimes references. Specific requirements may vary depending on the property and the length of stay.",
      },
      {
        question: "Can I view a property before booking?",
        answer:
          "Yes, we can arrange property viewings for interested tenants. Contact our support team to schedule a viewing at your convenience. For shortlets, we also provide detailed photos and virtual tours on our listings.",
      },
    ],
    apletfix: [
      {
        question: "What is ApletFix?",
        answer:
          "ApletFix is our home maintenance service that connects you with vetted, reliable artisans across Nigeria. We offer professional services for plumbing, electrical work, cleaning, carpentry, painting, appliance repair, and more - all at competitive rates with guaranteed quality.",
      },
      {
        question: "What services does ApletFix offer?",
        answer:
          "ApletFix offers comprehensive home services including cleaning, plumbing, electrical work, carpentry, painting, gardening, appliance repair, HVAC, locksmith services, pest control, furniture assembly, moving services, interior design consultation, and home security installation.",
      },
      {
        question: "How do I request an ApletFix service?",
        answer:
          "You can request ApletFix services by filling out the service request form on our Home Services page. Simply select your service type, provide your details and address, and our team will connect you with qualified professionals in your area.",
      },
      {
        question: "Are ApletFix artisans verified and insured?",
        answer:
          "Yes, all ApletFix artisans undergo thorough verification including background checks, skill assessments, and insurance coverage. We only work with qualified, licensed professionals to ensure quality and safety.",
      },
      {
        question: "How much do ApletFix services cost?",
        answer:
          "ApletFix service costs vary depending on the type of service, complexity, and location. We provide competitive rates and transparent pricing with no hidden charges. You'll receive a detailed quote before work begins.",
      },
      {
        question: "Can I earn free ApletFix services?",
        answer:
          "Yes! Through our referral program, you can earn free ApletFix services by referring friends to Aplet360. Get 1 FREE Home Fix service for every 5 landlords/property managers or 20 tenants you refer who verify their accounts.",
      },
    ],
    referral: [
      {
        question: "How does the referral program work?",
        answer:
          "Our referral program rewards you with free ApletFix services when you refer friends to Aplet360. Share your unique referral link, and when they register and verify their accounts, you both qualify for rewards. It's a win-win for everyone!",
      },
      {
        question: "What rewards can I earn through referrals?",
        answer:
          "You can earn free ApletFix services including plumbing, electrical work, painting, carpentry, and general repairs. Get 1 FREE service for every 5 landlords/property managers you refer, or 1 FREE service for every 20 tenants you refer who verify their accounts.",
      },
      {
        question: "How do I get my referral link?",
        answer:
          "Once you create an account and log in, you'll automatically get a unique referral link. You can find this in your dashboard or referral program page. Share this link with friends and family to start earning rewards.",
      },
      {
        question: "Do I get cash rewards?",
        answer:
          "No, we don't offer cash rewards. Instead, we reward you with valuable ApletFix services that you can use for home repairs and maintenance - services you actually need and would otherwise pay for.",
      },
      {
        question: "How do I track my referral progress?",
        answer:
          "You can track your referral progress in your dashboard, which shows your total referrals, verified referrals, pending verifications, and earned rewards. The dashboard updates in real-time as your referrals complete their verification.",
      },
    ],
    marketplace: [
      {
        question: "What is the Aplet360 Marketplace?",
        answer:
          "The Aplet360 Marketplace is our upcoming one-stop shop for home products, utilities, food items, and everything you need for comfortable living. It will offer curated selection of quality products with fast delivery to your doorstep.",
      },
      {
        question: "When will the marketplace be available?",
        answer:
          "Our marketplace is currently in development and will be launching soon. We're working hard to bring you an amazing shopping experience with quality products from trusted suppliers. Stay tuned for updates!",
      },
      {
        question: "What products will be available in the marketplace?",
        answer:
          "The marketplace will feature furniture, appliances, home decor, utility products, food items, and everything you need to make your apartment feel like home. All products will be carefully curated for quality and value.",
      },
      {
        question: "Will marketplace products be exclusive to Aplet360 tenants?",
        answer:
          "The marketplace will be available to all Aplet360 users, but tenants may receive special discounts and exclusive deals as part of their tenant benefits package.",
      },
    ],
    management: [
      {
        question: "Do you offer property management services?",
        answer:
          "Yes, we offer comprehensive property management services for property owners. Our services include tenant screening, rent collection, maintenance coordination, legal compliance, and full property administration to maximize your returns.",
      },
      {
        question: "What property management services do you provide?",
        answer:
          "Our property management services include listing creation and management, apartment marketing, quick apartment placement, check-in & check-out management, tenant & landlord protection, 24/7 maintenance & support, rental administration & accounting, guaranteed rental income, guest and tenant verification, and property maintenance, renovation, and improvement.",
      },
      {
        question: "How much do property management services cost?",
        answer:
          "Our property management service fee ranges from 5% to 10% of annual rent, depending on the level of service required. We offer transparent pricing with no hidden fees, and our services are designed to maximize your rental income.",
      },
      {
        question: "Do you guarantee rental income?",
        answer:
          "Yes, we offer guaranteed rental income all year round for property owners who choose our full management service. This ensures consistent returns on your investment regardless of market fluctuations.",
      },
      {
        question: "How do you handle tenant screening?",
        answer:
          "We conduct thorough tenant screening including background checks, income verification, rental history, and reference checks. Our comprehensive screening process helps ensure reliable tenants and reduces the risk of payment issues.",
      },
    ],
    security: [
      {
        question: "Is it safe to book through Aplet360?",
        answer:
          "Yes, we implement strict security measures and verify all properties and users on our platform to ensure a safe booking experience. Our secure payment system protects your financial information, and we have a verification process for all property listings.",
      },
      {
        question: "How do you protect my personal information?",
        answer:
          "We take data privacy seriously and comply with relevant data protection regulations. Your personal information is encrypted and securely stored. We do not share your information with third parties without your consent, except as required to facilitate your booking.",
      },
      {
        question: "What happens if there's an issue with my booking?",
        answer:
          "If you encounter any issues with your booking, our customer support team is available to assist. We have a dispute resolution process in place and will work with both you and the property owner to find a satisfactory solution.",
      },
      {
        question: "Are payments processed securely?",
        answer:
          "Yes, all payments are processed through secure payment gateways with encryption and fraud protection. We never store your payment card details and use industry-standard security measures to protect your financial information.",
      },
      {
        question: "How do you verify property owners and landlords?",
        answer:
          "We verify property ownership documents, conduct background checks on landlords, and ensure all listings meet our quality standards. This protects tenants from scams and ensures they're dealing with legitimate property owners.",
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
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Find answers to common questions about our apartment rentals,
            shortlets, ApletFix services, and more.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-primary-900 transition-colors">
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
                    ? "bg-primary-900 text-white"
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
                                <FiChevronUp className="flex-shrink-0 text-primary-900" />
                              ) : (
                                <FiChevronDown className="flex-shrink-0 text-primary-900" />
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
                        <FiChevronUp className="flex-shrink-0 text-primary-900" />
                      ) : (
                        <FiChevronDown className="flex-shrink-0 text-primary-900" />
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
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Space?
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-primary-100">
            Browse our selection of quality apartments, shortlets, and office
            spaces with flexible payment options designed to suit your needs.
          </p>
          <Link to="/book-now">
            <button className="bg-white text-primary-900 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors">
              Browse Properties
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
