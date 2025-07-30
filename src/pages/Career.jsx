import { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiUsers,
  FiAward,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import Modal from "../components/Modal";
import axios from "../utils/axios";
import LoadingScreen from "../components/LoadingScreen";

export default function Career() {
  const [isOpeningsModalOpen, setIsOpeningsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    jobType: "",
    experienceLevel: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });

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

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "Customer Support",
    "Operations",
    "Finance",
    "Human Resources",
    "Legal",
    "Other",
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Executive"];

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 6,
        ...filters,
      });

      const response = await axios.get(`/jobs?${params}`);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatSalary = (salary) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: salary.currency || "NGN",
      minimumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} ${
      salary.period
    }`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Aplet360</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Join our team on a mission to transform Africa's property rental
            experience.
          </p>
        </div>
      </section>

      {/* About Working at Aplet360 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Image before the section */}
          <div className="mb-12 text-center">
            <img
              src="/images/why-work-with-us.jpeg"
              alt="Why Work With Us"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
            />
          </div>

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
          {/* Image before the section */}
          <div className="mb-12 text-center">
            <img
              src="/images/core-values.jpeg"
              alt="Our Core Values"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
            />
          </div>

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

      {/* Current Openings */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Current Job Openings</h2>
            <p className="max-w-3xl mx-auto text-primary-100">
              Explore our current opportunities and find the perfect role for
              your skills and experience.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4 mb-6"
            >
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange("jobType", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={filters.experienceLevel}
                onChange={(e) =>
                  handleFilterChange("experienceLevel", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingScreen />
            </div>
          ) : jobs.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleViewJob(job)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {job.title}
                            {job.isUrgent && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Urgent
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <FiMapPin className="mr-1" />
                            {job.location}
                            {job.isRemote && (
                              <span className="ml-2 text-green-600">
                                • Remote
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiBriefcase className="mr-2" />
                          {job.department} • {job.jobType}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiAward className="mr-2" />
                          {job.experienceLevel} Level
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiDollarSign className="mr-2" />
                          {formatSalary(job.salary)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="mr-2" />
                          Apply by {formatDate(job.applicationDeadline)}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {job.description.substring(0, 150)}...
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills &&
                          job.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        {job.skills && job.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage - 1,
                        }))
                      }
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-white">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage + 1,
                        }))
                      }
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBriefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Current Openings
              </h3>
              <p className="text-primary-100 mb-6">
                There are no current job openings at Aplet360 right now. Please
                check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Job Detail Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title={selectedJob?.title}
        size="lg"
      >
        {selectedJob && (
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-6">
              {/* Job Header */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedJob.title}
                      {selectedJob.isUrgent && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiMapPin className="mr-1" />
                      {selectedJob.location}
                      {selectedJob.isRemote && (
                        <span className="ml-2 text-green-600">• Remote</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <p className="font-medium">{selectedJob.department}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Job Type:</span>
                    <p className="font-medium">{selectedJob.jobType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Experience:</span>
                    <p className="font-medium">{selectedJob.experienceLevel}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Salary:</span>
                    <p className="font-medium">
                      {formatSalary(selectedJob.salary)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Job Description
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities &&
                selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1">
                      {selectedJob.responsibilities.map(
                        (responsibility, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                            <span className="text-gray-700">
                              {responsibility}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Requirements */}
              {selectedJob.requirements &&
                selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Requirements
                    </h4>
                    <ul className="space-y-1">
                      {selectedJob.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Nice to Have */}
              {selectedJob.niceToHave && selectedJob.niceToHave.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Nice to Have
                  </h4>
                  <ul className="space-y-1">
                    {selectedJob.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Deadline */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-2" />
                    Apply by {formatDate(selectedJob.applicationDeadline)}
                  </div>
                  <a
                    href="mailto:careers@aplet360.com?subject=Application for %20{selectedJob.title}"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
