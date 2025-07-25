import React from "react";

const TermsConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tertiary-900 mb-8">
        Terms and Conditions
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-tertiary-700 mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="mb-4">
          By accessing or using Aplet360's website and services, you agree to be
          bound by these Terms and Conditions. If you do not agree to all the
          terms and conditions, you may not access or use our services.
        </p>

        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">
          2. User Accounts
        </h2>
        <p className="mb-4">
          When you create an account with us, you must provide accurate,
          complete, and current information. You are responsible for
          safeguarding your account credentials and for any activities or
          actions under your account.
        </p>
        <p className="mb-4">
          To use our platform fully, you must complete the registration payment
          and KYC verification process. Accounts that have not completed these
          steps will have limited functionality.
        </p>

        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">
          3. Booking and Payments
        </h2>
        <p className="mb-4">
          All bookings made through our platform are subject to availability and
          confirmation. Payment terms vary depending on the type of booking
          (rental or shortlet) and the payment option selected.
        </p>
        <p className="mb-6">
          For monthly rental payments, we partner with leading financial
          institutions to offer flexible payment solutions with competitive
          rates and terms designed to make quality housing accessible for
          everyone.
        </p>

        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">
          4. Property Listings
        </h2>
        <p className="mb-4">
          Property owners are responsible for providing accurate information
          about their properties. Aplet360 reserves the right to remove any
          listing that violates our policies or contains inaccurate information.
        </p>

        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">
          5. Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about these Terms and Conditions, please
          contact us at:
        </p>
        <p className="mb-4">
          <strong>Email:</strong> support@aplet360.com
          <br />
          <strong>Phone:</strong> 09122842288
          <br />
          <strong>Address:</strong> 38, Opebi Road, Adebola House, Ikeja Lagos
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
