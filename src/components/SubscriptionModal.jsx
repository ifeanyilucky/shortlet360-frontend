import { fCurrency } from "../utils/formatNumber";
import InteractiveButton from "./InteractiveButton";
import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "./Modal";
import { walletService, subscriptionService } from "../services/api";
import useWalletStore from "../store/walletStore";
import toast from "react-hot-toast";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { flutterwaveConfig } from "../config/flutterwave";
import { useAuth } from "../hooks/useAuth";

export default function SubscriptionModal({
  tier,
  handleCancel,
  isOpen,
  wallet,
  user,
}) {
  const [initiateSubscription, setInitiateSubscription] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { debitWallet } = useWalletStore();
  const { user: profile } = useAuth();
  console.log("tier", tier);
  // const handlePayNow = async () => {
  //   try {
  //     setPaymentLoading(true);
  //     const response = await walletService.debitWallet(tier?.amount);
  //     console.log("debit wallet response", response);
  //     debitWallet(response.data.wallet, response.data.transaction);
  //     setPaymentLoading(false);
  //   } catch (error) {
  //     setPaymentLoading(false);
  //     toast.error(error.response.data.message);
  //   }
  // };

  const handleFlutterPayment = useFlutterwave(
    flutterwaveConfig({ ...profile, amount: tier?.amount })
  );

  const handlePayNow = async (paymentMethod) => {
    setPaymentLoading(true);
    try {
      const response = await subscriptionService.subscribeToCreator({
        creatorId: user?._id,
        planId: tier?._id,
        paymentMethod,
      });
      console.log("subscribe response", response);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Payment failed");
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const SubscriptionContent = () => (
    <div>
      <p className="text-gray-500 mb-4">
        {fCurrency(tier?.amount)}/ {tier?.noOfMonths} month(s)
      </p>
      <p className="text-primary font-medium mb-2">Subscription benefits</p>
      <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
        <li>Full access to this user&apos;s content</li>
        <li>Send direct messages to this user</li>
        <li>Be the first to know when this user publishes new posts</li>
        <li>Cancel your subscription anytime</li>
      </ul>
      <div className="flex justify-end">
        <div className="flex gap-4 mt-8">
          <InteractiveButton onClick={() => setInitiateSubscription(true)}>
            Continue
          </InteractiveButton>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Your subscription will automatically renew every {tier?.noOfMonths}{" "}
          month(s). If you do not wish to renew, you can cancel anytime.
        </p>
      </div>
    </div>
  );

  const PaymentContent = () => (
    <div>
      <div>
        <div className="rounded-md border  p-3 flex">
          <div className="flex-1 border-r border-gray-300 pr-3">
            <p className="text-gray-500">Wallet balance</p>
          </div>
          <div className="flex-1 text-right">{fCurrency(wallet.balance)}</div>
        </div>
        <div className="mt-5 flex flex-end w-full items-end justify-end">
          <InteractiveButton
            isLoading={paymentLoading}
            onClick={() => handlePayNow("wallet")}
          >
            Pay now
          </InteractiveButton>
        </div>

        <div className="">
          <p>Select other payment method</p>
          <div className="mt-5 flex flex-row gap-2">
            <InteractiveButton
              onClick={() => {
                handleFlutterPayment({
                  callback: async (response) => {
                    console.log(response);

                    // await walletService.
                    handlePayNow("flutterwave");
                    handleCancel();
                    closePaymentModal(); // this will close the modal programmatically
                  },
                  onClose: () => {},
                });
              }}
              className="!flex items-center gap-2"
            >
              <span>Flutterwave</span>
              <span>
                <img
                  src="/icon/flutterwave.svg"
                  alt="Flutterwave"
                  className="w-4"
                />
              </span>
            </InteractiveButton>
            <InteractiveButton className="!flex items-center gap-2">
              <span>Paystack</span>
              <span>
                <img src="/icon/paystack.svg" alt="Paystack" className="w-4" />
              </span>
            </InteractiveButton>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={initiateSubscription ? "Confirm your order" : "Subscription"}
    >
      {!initiateSubscription ? <SubscriptionContent /> : <PaymentContent />}
    </Modal>
  );
}

SubscriptionModal.propTypes = {
  tier: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  wallet: PropTypes.object,
  user: PropTypes.object,
};
