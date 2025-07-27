import React from "react";
import { BsX, BsCheckCircle } from "react-icons/bs";

const TenantAgreementModal = ({ isOpen, onClose, onAgree, propertyName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Tenant Agreement
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BsX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                Property: {propertyName}
              </h4>
              <p className="text-blue-700 text-sm">
                Please read the following agreement carefully before proceeding
                with your rental application.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">
                1. Rental Terms and Conditions
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • By proceeding with this rental application, you agree to the
                  terms and conditions outlined in this agreement.
                </p>
                <p>
                  • The rental period will be for one (1) year from the lease
                  start date.
                </p>
                <p>• Monthly rent payments are due on the 1st of each month.</p>
                <p>
                  • A security deposit equivalent to one month's rent is
                  required and will be refunded upon lease termination, subject
                  to property condition.
                </p>
              </div>

              <h4 className="font-semibold text-gray-800">
                2. Tenant Responsibilities
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • Maintain the property in good condition and report any
                  damages promptly.
                </p>
                <p>
                  • Pay all utility bills and other services as agreed upon.
                </p>
                <p>
                  • Respect the property and neighbors, maintaining a peaceful
                  environment.
                </p>
                <p>
                  • Provide accurate and complete information for the rental
                  application.
                </p>
              </div>

              <h4 className="font-semibold text-gray-800">3. Payment Terms</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • Initial payment includes: Annual rent, Security deposit,
                  Agency fee, Commission fee, and Legal fee.
                </p>
                <p>• Late payments may incur additional charges.</p>
                <p>• Payment methods accepted: Paystack, Bank Transfer.</p>
              </div>

              <h4 className="font-semibold text-gray-800">
                4. Property Access and Maintenance
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • The landlord reserves the right to access the property for
                  maintenance and inspections with prior notice.
                </p>
                <p>
                  • Emergency maintenance will be handled promptly by the
                  property management team.
                </p>
                <p>
                  • Tenants must report maintenance issues within 24 hours of
                  discovery.
                </p>
              </div>

              <h4 className="font-semibold text-gray-800">
                5. Termination and Renewal
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• The lease agreement is for a fixed term of one year.</p>
                <p>
                  • Early termination may incur penalties as outlined in the
                  full lease agreement.
                </p>
                <p>
                  • Renewal terms will be discussed 30 days before lease
                  expiration.
                </p>
              </div>

              <h4 className="font-semibold text-gray-800">
                6. Legal Compliance
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • All parties must comply with local rental laws and
                  regulations.
                </p>
                <p>
                  • Disputes will be resolved through mediation or legal
                  channels as appropriate.
                </p>
                <p>
                  • This agreement is subject to applicable laws and
                  regulations.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <BsCheckCircle className="w-5 h-5" />
                Important Notice
              </h4>
              <p className="text-yellow-700 text-sm">
                By clicking "I Agree", you confirm that you have read,
                understood, and agree to all terms and conditions outlined in
                this tenant agreement. You also confirm that all information
                provided in your application is accurate and complete.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-xs px-2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAgree}
              className="flex-1 text-xs px-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              I Agree - Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAgreementModal;
