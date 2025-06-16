import React from 'react';
import { FiCheckCircle, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import InteractiveButton from './InteractiveButton';

const PropertyManagementSuccess = ({ onClose, applicationData }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-elevated">
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your interest in our property management services. 
          We have received your application and will contact you soon.
        </p>

        {/* Application Details */}
        {applicationData && (
          <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Application ID:</span>
                <span className="font-medium text-gray-900">{applicationData.applicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium text-gray-900">{applicationData.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Properties:</span>
                <span className="font-medium text-gray-900">{applicationData.numberOfProperties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Response:</span>
                <span className="font-medium text-green-600">{applicationData.estimatedResponse}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8 text-left">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            What Happens Next?
          </h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Our property management team will review your application</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>We'll contact you within 24-48 hours to schedule a consultation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Property assessment and market analysis will be conducted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Management agreement and onboarding process begins</span>
            </li>
          </ol>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Immediate Assistance?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMail className="text-primary-600" />
              <span className="text-sm">property-management@aplet360.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone className="text-primary-600" />
              <span className="text-sm">+234 (0) 123 456 7890</span>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <p className="text-sm text-yellow-800">
            📧 A confirmation email has been sent to your email address with all the details 
            of your application and next steps.
          </p>
        </div>

        {/* Close Button */}
        <InteractiveButton 
          onClick={onClose}
          variant="primary"
          className="px-8 py-3"
        >
          Close
        </InteractiveButton>
      </div>
    </div>
  );
};

export default PropertyManagementSuccess;
