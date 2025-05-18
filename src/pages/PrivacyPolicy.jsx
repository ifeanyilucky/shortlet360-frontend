import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-tertiary-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-tertiary-700 mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Aplet360 ("we," "our," or "us"). We are committed to protecting your privacy and personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
          or use our services.
        </p>
        
        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">2. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information that you provide directly to us, such as:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Contact information (name, email address, phone number)</li>
          <li>Account information (username, password)</li>
          <li>Profile information (profile picture, preferences)</li>
          <li>Payment information (credit card details, billing address)</li>
          <li>Identity verification information (NIN, address verification)</li>
          <li>Communication information (messages, feedback)</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect for various purposes, including:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Providing and maintaining our services</li>
          <li>Processing transactions and bookings</li>
          <li>Verifying your identity</li>
          <li>Communicating with you about our services</li>
          <li>Improving our website and services</li>
          <li>Complying with legal obligations</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-tertiary-800 mt-8 mb-4">4. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          <strong>Email:</strong> support@aplet360.com<br />
          <strong>Phone:</strong> 09038775464<br />
          <strong>Address:</strong> 38, Opebi Road, Adebola House, Car Park Wing, Ikeja Lagos
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
