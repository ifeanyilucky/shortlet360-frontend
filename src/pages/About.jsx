import { FiUsers, FiHome, FiCheckCircle, FiStar } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { BsBuilding, BsShieldCheck, BsCreditCard2Front } from "react-icons/bs";
import { Link } from "react-router-dom";
import InteractiveButton from "../components/InteractiveButton";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Aplet360
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Your trusted partner for quality apartment rentals and short-term
            accommodations across Nigeria.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img
                src="/images/living-room.jpg"
                alt="Modern Apartment"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2020, Aplet360 was created to address the growing
                need for quality apartment rentals in Nigeria. We started as a
                small platform connecting property owners with those seeking
                short-term stays, and have since evolved into a comprehensive
                rental solution.
              </p>
              <p className="text-gray-600 mb-6">
                Today, we focus primarily on long-term apartment rentals while
                still offering short-term accommodations. Our platform provides
                flexible payment options, including two monthly payment plans to
                make quality housing accessible to everyone.
              </p>
              <p className="text-gray-600">
                With thousands of satisfied residents and property owners, we
                continue to grow our offerings while maintaining our commitment
                to quality, transparency, and exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Our Mission, Vision & Values
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At Aplet360, we're driven by a clear purpose and guided by strong
              values.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHome className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To revolutionize the rental market by providing a seamless,
                transparent, and reliable platform for both property owners and
                residents, with a focus on quality apartments and flexible
                payment options.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiStar className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the most trusted and preferred platform for apartment
                rentals across Africa, known for our quality listings,
                innovative payment solutions, and exceptional customer service.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  <span>Transparency in all transactions</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  <span>Quality and reliability in our listings</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  <span>Customer-centric approach</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  <span>Innovation in payment solutions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Aplet360 provides comprehensive solutions for both apartment
              rentals and short-term stays.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdApartment className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Quality Apartments</h3>
              <p className="text-gray-600 text-sm">
                Carefully vetted apartments that meet our high standards for
                comfort and amenities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsCreditCard2Front className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Flexible Payments</h3>
              <p className="text-gray-600 text-sm">
                Two monthly payment options: 2% interest on rent with upfront
                fees, or 3% interest with all costs divided monthly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsShieldCheck className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Secure Platform</h3>
              <p className="text-gray-600 text-sm">
                Verified listings and secure payment processing for peace of
                mind.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Dedicated Support</h3>
              <p className="text-gray-600 text-sm">
                Our team is available to assist with any questions or concerns
                throughout your rental journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-primary-100">Happy Residents</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1200+</div>
              <div className="text-primary-100">Quality Apartments</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals behind Aplet360.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 bg-gray-200">
                {/* Placeholder for team member photo */}
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <BsBuilding className="w-16 h-16 text-primary-500" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">John Doe</h3>
                <p className="text-primary-500 mb-4">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm">
                  With over 15 years of experience in real estate, John leads
                  our vision for transforming the rental market.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 bg-gray-200">
                {/* Placeholder for team member photo */}
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <BsBuilding className="w-16 h-16 text-primary-500" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">Jane Smith</h3>
                <p className="text-primary-500 mb-4">
                  Chief Operations Officer
                </p>
                <p className="text-gray-600 text-sm">
                  Jane ensures our platform runs smoothly and that every
                  customer receives exceptional service.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 bg-gray-200">
                {/* Placeholder for team member photo */}
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <BsBuilding className="w-16 h-16 text-primary-500" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">Michael Johnson</h3>
                <p className="text-primary-500 mb-4">
                  Chief Technology Officer
                </p>
                <p className="text-gray-600 text-sm">
                  Michael leads our tech team in developing innovative solutions
                  for our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Apartment?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Browse our selection of quality apartments with flexible payment
            options designed to suit your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-now">
              <InteractiveButton>Browse Apartments</InteractiveButton>
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
