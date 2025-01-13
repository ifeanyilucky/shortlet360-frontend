import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import InteractiveButton from "../../components/InteractiveButton";

export default function Payment() {
  const [showModal, setShowModal] = useState(false);
  const expiryRef = useRef(null);
  const cvcRef = useRef(null);
  const cardholderRef = useRef(null);
  const [cardNumber, setCardNumber] = useState("");
  const [defaultCard, setDefaultCard] = useState(false);
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    // Add slash after MM if length is 2 or more
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    // Limit to MM/YY format
    value = value.slice(0, 5);

    e.target.value = value;

    // Auto-focus to CVC when MM/YY is complete
    if (value.length === 5) {
      cvcRef.current?.focus();
    }
  };

  const handleCVCChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    value = value.slice(0, 3); // Limit to 3 digits
    e.target.value = value;

    // Auto-focus to cardholder name when CVC is complete
    if (value.length === 3) {
      cardholderRef.current?.focus();
    }
  };

  const handleAddCard = () => {
    const data = {
      cardNumber: cardNumber,
      expiryDate: expiryRef.current.value,
      cvc: cvcRef.current.value,
      cardholderName: cardholderRef.current.value,
      default: defaultCard,
    };
    console.log("add card", data);
    // setShowModal(false);
  };

  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-4">Linked Card</h4>
          <p className="text-gray-500">
            Your monthly subscription will be charged to this card.
          </p>
        </div>
        <div className="flex-1"></div>
      </div>

      <div className="mt-4">
        {/* Payment Button */}
        <InteractiveButton className="" onClick={() => setShowModal(true)}>
          Add Payment Method
        </InteractiveButton>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowModal(false)}
          />
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Add Payment Method</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Icon icon="hugeicons:close" />
                </button>
              </div>

              {/* Form */}
              <form className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Fansmi is fully compliant with the Payment Card Industry
                    Data Security Standard (PCI DSS).
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="1234 1234 1234 1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      ref={expiryRef}
                      onChange={handleExpiryChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      ref={cvcRef}
                      onChange={handleCVCChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    ref={cardholderRef}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={defaultCard}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    onChange={() => setDefaultCard(!defaultCard)}
                  />
                  <p className="text-sm text-gray-900">Set as default</p>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <InteractiveButton
                    type="button"
                    onClick={handleAddCard}
                    className="flex-1"
                  >
                    Add Card
                  </InteractiveButton>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500">
                    We will make a one-time charge of $1.99 to verify your card.
                  </span>
                  <span className="text-sm text-gray-500">
                    This and any future charges will be billed to this card.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
