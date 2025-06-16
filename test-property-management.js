// Simple test script to verify the property management form submission
// Run this with: node test-property-management.js

const axios = require('axios');

const testData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+234 123 456 7890",
  propertyType: "Apartment",
  numberOfProperties: 3,
  address: {
    street: "123 Test Street",
    area: "Victoria Island",
    localGovernment: "Lagos Island",
    state: "Lagos"
  },
  agreeToFee: true
};

async function testPropertyManagementForm() {
  try {
    console.log('🧪 Testing Property Management Form Submission...\n');
    
    // Assuming backend is running on port 5000
    const response = await axios.post('http://localhost:5000/api/forms/property-management', testData);
    
    console.log('✅ Success!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the test
testPropertyManagementForm();
