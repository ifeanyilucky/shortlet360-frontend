import { FiUsers, FiHome, FiCheckCircle, FiStar } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { BsBuilding, BsShieldCheck, BsCreditCard2Front } from "react-icons/bs";
import { Link } from "react-router-dom";
import InteractiveButton from "../components/InteractiveButton";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-900 to-primary-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            About Aplet360
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-2 animate-slide-up">
            Your Home with a Click.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img
                src="/images/living-room.jpg"
                alt="Modern Apartment"
                className="rounded-2xl shadow-elevated w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-tertiary-900">
                About Us
              </h2>
              <p className="text-tertiary-600 mb-6 text-lg">
                Aplet360 is Africa&apos;s premier apartment rental and shortlet
                solutions company, offering individuals, families, travelers,
                and corporate clients seamless access to quality, verified, and
                affordable property options across major cities in Nigeria and
                Africa while providing 360 degree seamless home services
                designed to elevate everyday living for Africans. We&apos;re not
                just providing homes, we&apos;re providing lifestyles built on
                trust, comfort, and excellence.
              </p>
              <p className="text-tertiary-600 text-lg">
                We are redefining the property rental experience by eliminating
                trust barriers, promoting transparency, and providing a premium,
                customer-first service that guarantees peace of mind. Our
                portfolio spans rental apartments, luxury apartments, affordable
                shortlets, serviced homes, meticulously vetted to meet the
                highest standards of comfort, security, and style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-tertiary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary-900">
              Our Mission, Vision & Core Values
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              At Aplet360, we&apos;re driven by a clear purpose and guided by
              strong values.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiHome className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900">
                Our Mission
              </h3>
              <p className="text-tertiary-600">
                To deliver seamless property access and exceptional home
                services that enhance living standards across Africa, powered by
                technology, transparency, and innovation.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiStar className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900">
                Our Vision
              </h3>
              <p className="text-tertiary-600">
                To become Africa&apos;s most trusted platform for premium
                property solutions and home lifestyle services.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900">
                Our Core Values
              </h3>
              <ul className="text-tertiary-600 text-left space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Trust & Transparency: Uncompromised authenticity in
                    everything we do.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Excellence: Setting industry benchmarks for property and
                    home service solutions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Customer First: Every decision revolves around improving
                    customer experience.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Innovation: Creating smarter ways to live, rent, and manage
                    properties.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Commitment: Consistent support and dependable service across
                    all touchpoints.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Value Proposition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-tertiary-600 max-w-4xl mx-auto text-lg mb-12">
              At Aplet360, we are not just connecting people to homes; we are
              building trust, creating memories, and leading the transformation
              of Africa&apos;s property rental industry. We combine trusted
              property solutions with comprehensive home management services,
              giving residents and guests the ultimate peace of mind. Whether
              it&apos;s finding the perfect rental property, shortlet
              apartments, or managing your home services — Aplet360 is your
              trusted partner for living smarter, better, and safer.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary-900">
              Unique Value Proposition (UVP)
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              What sets Aplet360 apart from the rest
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <BsBuilding className="w-6 h-6 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                All-in-One Platform
              </h3>
              <p className="text-tertiary-600">
                Find a home, furnish it, fix things, shop online, maintain your
                apartment, and general services all under one trusted brand.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center mb-4">
                <BsShieldCheck className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Double Verified Properties
              </h3>
              <p className="text-tertiary-600">
                Listings undergo a strict vetting process — both digitally and
                physically verified.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <FiCheckCircle className="w-6 h-6 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Zero Fraud Guarantee
              </h3>
              <p className="text-tertiary-600">
                Our operations are built on digital security, transparency, and
                on-ground inspections.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center mb-4">
                <FiStar className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Premium Yet Affordable
              </h3>
              <p className="text-tertiary-600">
                Quality living experiences tailored to fit various budgets
                without compromising standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <MdApartment className="w-6 h-6 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Flexible Living Solutions
              </h3>
              <p className="text-tertiary-600">
                Options for monthly and yearly leasing for rental apartments
                while then daily to monthly lease for shortlet apartments across
                Nigeria and expanding into African cities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                AI-Enhanced Customer Experience
              </h3>
              <p className="text-tertiary-600">
                Personalized recommendations, smart service bookings, and
                instant response systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-tertiary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary-900">
              What We Offer
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              Aplet360 provides comprehensive solutions for both apartment
              rentals and short-term stays.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MdApartment className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Quality Apartments
              </h3>
              <p className="text-tertiary-600">
                Carefully vetted apartments that meet our high standards for
                comfort and amenities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BsCreditCard2Front className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Flexible Payments
              </h3>
              <p className="text-tertiary-600">
                Two monthly payment options: 1.5% interest on rent with upfront
                fees, or 2% interest with all costs divided monthly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BsShieldCheck className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Secure Platform
              </h3>
              <p className="text-tertiary-600">
                Verified listings and secure payment processing for peace of
                mind.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Dedicated Support
              </h3>
              <p className="text-tertiary-600">
                Our team is available to assist with any questions or concerns
                throughout your rental journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-primary-900 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-primary-100">Happy Residents</div>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">1200+</div>
              <div className="text-primary-100">Quality Apartments</div>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Cities Covered</div>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-tertiary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-tertiary-900">
            Ready to Experience Seamless Living?
          </h2>
          <p className="text-tertiary-600 max-w-3xl mx-auto mb-8 text-lg">
            Browse our selection of quality apartments and shortlets with
            flexible payment options designed to suit your lifestyle needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-now">
              <InteractiveButton variant="accent">
                Browse Properties
              </InteractiveButton>
            </Link>
            <Link to="/contact">
              <InteractiveButton variant="secondary">
                Contact Us
              </InteractiveButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
