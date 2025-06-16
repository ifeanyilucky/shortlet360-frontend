const mongoose = require("mongoose");
const DiscountCode = require("../models/discountCode");
const User = require("../models/user");
require("dotenv").config();

const seedDiscountCode = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find an admin user to set as creator (or create a system user)
    let adminUser = await User.findOne({ role: "admin" });
    
    if (!adminUser) {
      console.log("No admin user found. Creating system admin for discount code creation...");
      // Create a system admin user for discount code creation
      adminUser = await User.create({
        first_name: "System",
        last_name: "Admin",
        email: "system@aplet360.com",
        password: "SystemAdmin123!",
        role: "admin",
        short_id: "SYS001",
        is_active: true,
        is_verified: true,
        registration_payment_status: "paid",
      });
      console.log("System admin created");
    }

    // Check if pre-launch discount code already exists
    const existingCode = await DiscountCode.findOne({ code: "PRELAUNCH50" });
    
    if (existingCode) {
      console.log("Pre-launch discount code already exists:", existingCode.code);
      return;
    }

    // Create pre-launch discount code
    const discountCode = await DiscountCode.create({
      code: "PRELAUNCH50",
      description: "Pre-launch 50% discount on owner registration fee",
      discount_type: "percentage",
      discount_value: 50,
      applicable_to: "registration_fee",
      max_uses: null, // Unlimited uses
      is_active: true,
      valid_from: new Date(),
      valid_until: null, // No expiry
      created_by: adminUser._id,
    });

    console.log("Pre-launch discount code created successfully:");
    console.log({
      code: discountCode.code,
      description: discountCode.description,
      discount_value: `${discountCode.discount_value}%`,
      applicable_to: discountCode.applicable_to,
    });

    // Create additional discount codes for testing
    const additionalCodes = [
      {
        code: "WELCOME25",
        description: "Welcome 25% discount on registration fee",
        discount_type: "percentage",
        discount_value: 25,
        applicable_to: "registration_fee",
        max_uses: 100,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        created_by: adminUser._id,
      },
      {
        code: "FIXED5000",
        description: "Fixed ₦5,000 discount on registration fee",
        discount_type: "fixed",
        discount_value: 5000,
        applicable_to: "registration_fee",
        max_uses: 50,
        is_active: true,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        created_by: adminUser._id,
      },
    ];

    for (const codeData of additionalCodes) {
      const existing = await DiscountCode.findOne({ code: codeData.code });
      if (!existing) {
        const newCode = await DiscountCode.create(codeData);
        console.log(`Additional discount code created: ${newCode.code}`);
      } else {
        console.log(`Discount code ${codeData.code} already exists`);
      }
    }

    console.log("\nDiscount codes seeding completed!");
    console.log("\nAvailable discount codes:");
    console.log("- PRELAUNCH50: 50% off registration fee (unlimited uses, no expiry)");
    console.log("- WELCOME25: 25% off registration fee (100 uses, 30 days)");
    console.log("- FIXED5000: ₦5,000 off registration fee (50 uses, 60 days)");

  } catch (error) {
    console.error("Error seeding discount codes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the seeding function
if (require.main === module) {
  seedDiscountCode();
}

module.exports = seedDiscountCode;
