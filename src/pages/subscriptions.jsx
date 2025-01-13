import { useState } from "react";

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState("active");

  const tabs = [
    { id: "active", label: "Active" },
    { id: "expired", label: "Expired" },
    { id: "all", label: "All" },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Tabs Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex flex-col justify-center items-center flex-1">
        <p className="text-center">
          You don&apos;t have any {activeTab} subscriptions yet, they will
          display here once you are subscribed to someone.
        </p>
      </div>
    </div>
  );
}
