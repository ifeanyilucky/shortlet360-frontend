import useWalletStore from "../store/walletStore";
import { useEffect, useState } from "react";
import { fCurrency } from "../utils/formatNumber";
import InteractiveButton from "../components/InteractiveButton";
import Modal from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import CustomInput from "../components/CustomInput";
import { flutterwaveConfig } from "../config/flutterwave";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { walletService } from "../services/api";
import Transaction from "../components/Transaction";

export default function Wallet() {
  const [showFundWalletModal, setShowFundWalletModal] = useState(false);
  const {
    wallet,
    transactions,
    isLoading,
    error,
    getWallet,
    getTransactions,
    fundWallet,
  } = useWalletStore();
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    getWallet();
    getTransactions();
  }, []);
  console.log("wallet", wallet);
  console.log("transactions", transactions);
  const config = flutterwaveConfig({ ...user, amount });
  const handleFlutterPayment = useFlutterwave(config);

  if (isLoading && !wallet) return <div>Loading...</div>;
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Wallet</h1>
      </div>
      <div className="rounded-lg border border-gray-200 p-4 my-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-gray-500">Available balance</h2>
          <div className="text-4xl font-bold">{fCurrency(wallet?.balance)}</div>
        </div>
        <div className="space-y-2">
          <InteractiveButton
            className="!py-2"
            onClick={() => setShowFundWalletModal(true)}
          >
            Fund wallet
          </InteractiveButton>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold">Transactions</h2>
        <Transaction transactions={transactions?.transactions} />
      </div>

      <Modal
        isOpen={showFundWalletModal}
        onClose={() => setShowFundWalletModal(false)}
        title="Fund wallet"
      >
        <div>
          <div>
            <p className="text-gray-500">Available balance</p>
            <p className="text-3xl text-black font-extrabold">
              {fCurrency(wallet?.balance)}
            </p>
          </div>

          <div className="space-y-2 my-4">
            <CustomInput
              type="number"
              value={amount}
              label="Amount"
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mt-10 flex flex-col gap-2">
            <InteractiveButton
              disabled={amount < 1000}
              onClick={() => {
                handleFlutterPayment({
                  callback: async (response) => {
                    console.log(response);
                    const result = await walletService.creditWallet({
                      amount: response.amount,
                      transactionRef: response,
                      paymentMethod: "flutterwave",
                    });
                    // await walletService.

                    fundWallet(result.data.wallet, result.data.transaction);
                    setShowFundWalletModal(false);
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
      </Modal>
    </div>
  );
}
