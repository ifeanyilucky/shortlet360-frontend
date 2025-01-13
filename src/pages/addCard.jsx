import { useState } from "react";

export default function AddCard() {
  const [formData, setFormData] = useState({
    country: "Nigeria",
    state: "Lagos",
    address: "",
    city: "Lagos",
    zipCode: "",
    email: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvc: "",
    isAdult: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <button className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-xl font-medium">ADD CARD</h1>
        <div className="ml-auto">
          <button className="text-blue-500 font-medium">VERIFY</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-gray-600 mb-4">BILLING DETAILS</h2>
            <p className="text-gray-600 mb-6">
              We are fully compliant with Payment Card Industry Data Security
              Standards.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  >
                    <option value="Nigeria">Nigeria</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    State / Province
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  >
                    <option value="Lagos">Lagos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                </div>
              </div>

              <h2 className="text-gray-600 pt-4">CARD DETAILS</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Name on the card
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                <a href="#" className="text-blue-500 text-sm mt-1 block">
                  My card number is longer
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Expiration</label>
                  <input
                    type="text"
                    name="expiration"
                    placeholder="MM / YY"
                    value={formData.expiration}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg mt-1"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-4">
                <input
                  type="checkbox"
                  name="isAdult"
                  checked={formData.isAdult}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label className="text-sm text-gray-600">
                  Tick here to confirm that you are at least 18 years old and
                  the age of majority in your place of residence
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-32 float-right bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6">
            <div className="mb-8">
              <div className="text-3xl font-bold">$0</div>
              <div className="text-gray-600">Wallet credits</div>
            </div>

            <div className="mb-8">
              <h3 className="text-gray-600 mb-4">ADD FUNDS TO YOUR WALLET</h3>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                ADD A PAYMENT CARD
              </button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-gray-600">
                Make wallet primary method for rebills
              </span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>

            <div>
              <h3 className="text-gray-600 mb-4">LATEST TRANSACTIONS</h3>
              <div className="text-center text-gray-400 py-8">
                <div className="mb-2">📦</div>
                <div>No Payments done yet.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
