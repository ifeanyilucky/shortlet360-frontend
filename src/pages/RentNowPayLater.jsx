import { FiCreditCard, FiClock, FiDollarSign, FiUsers } from "react-icons/fi";

export default function RentNowPayLater() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Rent Now - Pay Later
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Flexible monthly payment solutions designed for daily, weekly, and monthly earners. 
            Move into your dream apartment today without the burden of large upfront payments.
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
                  <FiCreditCard className="h-16 w-16 text-accent-500" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-tertiary-800 mb-6">
                Coming Soon
              </h2>

              <p className="text-lg text-tertiary-600 mb-8 leading-relaxed">
                We&apos;re partnering with leading financial institutions to bring you 
                the most flexible and affordable monthly payment solutions. Our rent-now-pay-later 
                service will revolutionize how you access quality housing.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FiUsers className="h-8 w-8 text-primary-900" />
                  </div>
                  <h3 className="font-semibold text-tertiary-800 mb-2">
                    For Monthly Earners
                  </h3>
                  <p className="text-tertiary-600 text-sm">
                    Perfect for salary earners who receive monthly income. 
                    Align your rent payments with your salary schedule.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FiDollarSign className="h-8 w-8 text-primary-900" />
                  </div>
                  <h3 className="font-semibold text-tertiary-800 mb-2">
                    For Entrepreneurs
                  </h3>
                  <p className="text-tertiary-600 text-sm">
                    Ideal for business owners and freelancers with irregular income. 
                    Manage cash flow while securing quality housing.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FiClock className="h-8 w-8 text-primary-900" />
                  </div>
                  <h3 className="font-semibold text-tertiary-800 mb-2">
                    Flexible Terms
                  </h3>
                  <p className="text-tertiary-600 text-sm">
                    Choose payment plans that work for your lifestyle and income pattern. 
                    No more yearly rent stress.
                  </p>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-tertiary-800 mb-4 text-center">
                  How It Benefits You
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-tertiary-600">
                        <span className="font-medium text-tertiary-900">No Large Upfront Payments:</span> 
                        Move in with minimal initial costs
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-tertiary-600">
                        <span className="font-medium text-tertiary-900">Cash Flow Management:</span> 
                        Better manage your monthly budget and expenses
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-tertiary-600">
                        <span className="font-medium text-tertiary-900">Quick Approval:</span> 
                        Fast processing for qualified applicants
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-tertiary-600">
                        <span className="font-medium text-tertiary-900">Competitive Rates:</span> 
                        Partner with us for the best market rates
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-tertiary-600">
                        <span className="font-medium text-tertiary-900">Transparent Terms:</span> 
                        No hidden fees or surprise charges
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-tertiary-600">
                        <span className="font-medium text-tertiary-900">Flexible Options:</span> 
                        Multiple payment plans to suit your needs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
                <p className="text-accent-700 font-medium">
                  🚀 Stay tuned! We&apos;re finalizing partnerships with leading financial institutions 
                  to bring you the most competitive monthly payment solutions in the market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
