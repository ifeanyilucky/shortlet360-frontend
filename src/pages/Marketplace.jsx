import { FiShoppingBag, FiClock } from "react-icons/fi";

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative bg-primary-900 text-white py-20"
        style={{
          backgroundImage: "url(/images/marketplace.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-primary-900 bg-opacity-70"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Aplet360 Marketplace
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Your one-stop shop for home products, utilities, food items, and
            everything you need for comfortable living
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="flex justify-center mb-8">
                <div className="bg-accent-100 p-6 rounded-full">
                  <FiShoppingBag className="h-16 w-16 text-accent-500" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-tertiary-800 mb-6">
                Coming Soon
              </h2>

              <p className="text-lg text-tertiary-600 mb-8 leading-relaxed">
                We&apos;re working hard to bring you an amazing marketplace
                experience where you can shop for furniture, appliances, home
                decor, utility products, food items, and everything you need to
                make your apartment feel like home.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FiShoppingBag className="h-8 w-8 text-primary-900" />
                  </div>
                  <h3 className="font-semibold text-tertiary-800 mb-2">
                    Quality Products
                  </h3>
                  <p className="text-tertiary-600 text-sm">
                    Curated selection of home essentials, furniture, utilities,
                    and food items
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FiClock className="h-8 w-8 text-primary-900" />
                  </div>
                  <h3 className="font-semibold text-tertiary-800 mb-2">
                    Fast Delivery
                  </h3>
                  <p className="text-tertiary-600 text-sm">
                    Quick and reliable delivery to your doorstep
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-primary-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-tertiary-800 mb-2">
                    Trusted Quality
                  </h3>
                  <p className="text-tertiary-600 text-sm">
                    Verified products from trusted suppliers
                  </p>
                </div>
              </div>

              <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
                <p className="text-accent-700 font-medium">
                  🚀 Stay tuned! Our marketplace will be launching soon with
                  amazing deals and products for your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
