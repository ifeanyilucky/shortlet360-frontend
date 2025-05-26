import { useState } from "react";
import {
  FiBriefcase,
  FiUsers,
  FiAward,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";
import Modal from "../components/Modal";

export default function Career() {
  const [isOpeningsModalOpen, setIsOpeningsModalOpen] = useState(false);

  const values = [
    {
      icon: <FiHeart className="h-8 w-8 text-primary-900" />,
      title: "Customer First",
      description:
        "We prioritize our customers' needs and satisfaction in everything we do.",
    },
    {
      icon: <FiAward className="h-8 w-8 text-primary-900" />,
      title: "Excellence",
      description: "We strive for excellence in our services and operations.",
    },
    {
      icon: <FiUsers className="h-8 w-8 text-primary-900" />,
      title: "Teamwork",
      description:
        "We believe in collaboration and supporting each other to achieve our goals.",
    },
    {
      icon: <FiTrendingUp className="h-8 w-8 text-primary-900" />,
      title: "Innovation",
      description:
        "We embrace new ideas and technologies to improve our services.",
    },
    {
      icon: <FiGlobe className="h-8 w-8 text-primary-900" />,
      title: "Integrity",
      description:
        "We conduct our business with honesty, transparency, and ethical standards.",
    },
  ];

  const benefits = [
    "Competitive salary and benefits package",
    "Professional development opportunities",
    "Flexible work arrangements",
    "Collaborative and inclusive work environment",
    "Opportunity to make a real impact in Africa's property sector",
    "Health insurance coverage",
    "Annual performance bonuses",
    "Team building activities and events",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Careers at Aplet360
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Join our team on a mission to transform Africa's property rental
            experience.
          </p>
        </div>
      </section>

      {/* About Working at Aplet360 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-lg text-tertiary-600 max-w-3xl mx-auto">
              At Aplet360, we're building Africa's most trusted platform for
              premium property solutions and home lifestyle services. Join us on
              this exciting journey!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-tertiary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary-900">
                Our Mission
              </h3>
              <p className="text-tertiary-700 mb-6">
                We're on a mission to revolutionize the property rental
                experience in Africa by providing a seamless, transparent, and
                reliable platform for both property owners and tenants.
              </p>
              <p className="text-tertiary-700">
                Our team is dedicated to solving the challenges in the African
                property market through innovative technology and exceptional
                service.
              </p>
            </div>
            <div className="bg-tertiary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary-900">
                Our Culture
              </h3>
              <p className="text-tertiary-700 mb-6">
                We foster a culture of innovation, collaboration, and continuous
                learning. Our diverse team brings together different
                perspectives and experiences to create solutions that work for
                all Africans.
              </p>
              <p className="text-tertiary-700">
                We celebrate achievements, learn from challenges, and support
                each other's growth and development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-tertiary-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-tertiary-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-lg text-tertiary-600 max-w-3xl mx-auto">
              We value our team members and offer competitive benefits to
              support your professional and personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-tertiary-50 rounded-lg"
              >
                <div className="flex-shrink-0 mr-3">
                  <FiBriefcase className="h-6 w-6 text-primary-900" />
                </div>
                <p className="text-tertiary-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Team?</h2>
          <p className="max-w-3xl mx-auto mb-8 text-primary-100">
            Check out our current job openings and find the perfect role for
            your skills and experience.
          </p>
          <button
            onClick={() => setIsOpeningsModalOpen(true)}
            className="bg-white text-primary-900 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
          >
            Current Openings
          </button>
        </div>
      </section>

      {/* No Openings Modal */}
      <Modal
        isOpen={isOpeningsModalOpen}
        onClose={() => setIsOpeningsModalOpen(false)}
        title="Current Job Openings"
      >
        <div className="text-center py-6">
          <FiBriefcase className="h-16 w-16 text-tertiary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Current Openings</h3>
          <p className="text-tertiary-600 mb-6">
            There are no current job openings at Aplet360 right now. Please
            check back some other time.
          </p>
          <p className="text-tertiary-600">
            You can also send your resume to{" "}
            <a
              href="mailto:careers@aplet360.com"
              className="text-primary-900 hover:underline"
            >
              careers@aplet360.com
            </a>{" "}
            for future opportunities.
          </p>
        </div>
      </Modal>
    </div>
  );
}
