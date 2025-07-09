import React, { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import { MdApartment, MdManageAccounts, MdSecurity } from "react-icons/md";
import { BsBuilding, BsGraphUp, BsCreditCard2Front } from "react-icons/bs";
import { Link } from "react-router-dom";
import InteractiveButton from "../components/InteractiveButton";
import PropertyManagementModal from "../components/PropertyManagementModal";

export default function PropertyManagementSolutions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStarted = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section
        className="bg-gradient-to-b from-primary-900 to-primary-900 text-white py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(/images/properties-image.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-primary-900 bg-opacity-70"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Property Management Solutions
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8 animate-slide-up">
            Join other happy landlords who enjoys seamless property management
            plan at Aplet360 thar guarantees their peace of mind and all year
            round rental income.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InteractiveButton variant="accent" onClick={handleGetStarted}>
              Get Started Today
            </InteractiveButton>
            {/* <Link to="/book-now">
              <InteractiveButton variant="secondary">
                View Properties
              </InteractiveButton>
            </Link> */}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img
                src="/images/property-management.jpg"
                alt="Property Management"
                className="rounded-2xl shadow-elevated w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-tertiary-900">
                Professional Property Management
              </h2>
              <p className="text-tertiary-600 mb-6 text-lg">
                At Aplet360, we understand that property ownership should be an
                investment, not a burden. Our comprehensive property management
                solutions are designed to take the stress out of property
                ownership while maximizing your returns.
              </p>
              <p className="text-tertiary-600 mb-6 text-lg">
                Whether you own a single apartment or a portfolio of properties,
                our experienced team handles everything from tenant screening
                and rent collection to maintenance and legal compliance,
                ensuring your properties are well-maintained and profitable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-tertiary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary-900">
              Our Management Services
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              Comprehensive solutions to handle every aspect of your property
              investment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiUsers className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900 text-center">
                Tenant Management
              </h3>
              <ul className="text-tertiary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Comprehensive tenant screening and background checks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Lease agreement preparation and management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Move-in and move-out inspections</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>24/7 tenant support and communication</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BsCreditCard2Front className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900 text-center">
                Financial Management
              </h3>
              <ul className="text-tertiary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Automated rent collection and payment processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Monthly financial reporting and analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Expense tracking and budget management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Tax preparation assistance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiSettings className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900 text-center">
                Maintenance & Repairs
              </h3>
              <ul className="text-tertiary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Preventive maintenance scheduling</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Emergency repair coordination</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Vetted contractor network</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Quality assurance and follow-up</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BsGraphUp className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900 text-center">
                Marketing & Leasing
              </h3>
              <ul className="text-tertiary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Professional property photography</span>
                </li>

                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Market analysis and pricing optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Showing coordination and tenant tours</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MdSecurity className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900 text-center">
                Legal & Compliance
              </h3>
              <ul className="text-tertiary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Legal compliance monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Eviction process management</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Document management and storage</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Insurance coordination</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiTrendingUp className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-tertiary-900 text-center">
                Performance Analytics
              </h3>
              <ul className="text-tertiary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Real-time performance dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>ROI tracking and optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Market trend analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span>Investment recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary-900">
              Why Choose Aplet360 for Property Management?
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              Experience the difference with our technology-driven, transparent
              approach to property management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Trusted & Reliable
              </h3>
              <p className="text-tertiary-600">
                Licensed, insured, and bonded property management with a proven
                track record of success.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BsBuilding className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Technology-Driven
              </h3>
              <p className="text-tertiary-600">
                Advanced property management software for real-time updates and
                seamless communication.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Maximize Returns
              </h3>
              <p className="text-tertiary-600">
                Strategic pricing and efficient operations to maximize your
                rental income and property value.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MdManageAccounts className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3 text-tertiary-900">
                Full-Service Management
              </h3>
              <p className="text-tertiary-600">
                Complete end-to-end property management so you can focus on
                other investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-tertiary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-tertiary-900">
              Our Management Process
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              A streamlined approach to property management that delivers
              results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-3 text-tertiary-900">
                Property Assessment
              </h3>
              <p className="text-tertiary-600 text-sm">
                Comprehensive evaluation of your property to determine optimal
                rental pricing and necessary improvements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-3 text-tertiary-900">
                Marketing & Leasing
              </h3>
              <p className="text-tertiary-600 text-sm">
                Professional marketing across multiple platforms to attract
                quality tenants quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-3 text-tertiary-900">
                Tenant Screening
              </h3>
              <p className="text-tertiary-600 text-sm">
                Rigorous background checks and verification to ensure reliable,
                long-term tenants.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card text-center">
              <div className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-lg mb-3 text-tertiary-900">
                Ongoing Management
              </h3>
              <p className="text-tertiary-600 text-sm">
                Continuous property maintenance, rent collection, and tenant
                relations management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary-900 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Maximize Your Property Investment?
          </h2>
          <p className="text-primary-100 max-w-3xl mx-auto mb-8 text-lg">
            Let our experienced team handle your property management needs while
            you enjoy steady returns and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <InteractiveButton variant="secondary">
                Manage My Property
              </InteractiveButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Management Modal */}
      <PropertyManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
