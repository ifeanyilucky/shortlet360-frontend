import React from "react";
import InteractiveButton from "../../components/InteractiveButton";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CustomInput from "../../components/CustomInput";
export default function WithdrawalAccount() {
  const [activeScreen, setActiveScreen] = React.useState("index");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submitLoading, setSubmitLoading] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      console.log(data);
      toast.success("Withdrawal account added successfully");
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add withdrawal account");
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleAddCancel = () => {
    setActiveScreen("index");
  };
  return (
    <div>
      {activeScreen === "index" && (
        <>
          <div className="mb-5">
            <h1 className="text-2xl font-bold">Manage withdrawal</h1>
          </div>
          <div className="mb-5 space-y-3">
            <p className="text-sm font-medium mb-2">Withdrawal account</p>
            <p className="text-sm text-gray-500">
              Setup your withdrawal account to receive your earnings.
            </p>
            <InteractiveButton onClick={() => setActiveScreen("add")}>
              Add withdrawal account
            </InteractiveButton>
          </div>
        </>
      )}

      {activeScreen === "add" && (
        <div>
          <p className="text-2xl font-bold mb-3">Add withdrawal account</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Bank */}
              <CustomInput
                label="Bank"
                {...register("bank", {
                  required: "Bank is required",
                })}
                error={errors.bank?.message}
              />

              {/* Account Number */}
              <div className="flex items-center gap-4">
                <CustomInput
                  label="Account Number"
                  {...register("account_number", {
                    required: "Account number is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Please enter a valid account number",
                    },
                  })}
                  error={errors.account_number?.message}
                />
              </div>
              {/* Account Name */}
              <div className="flex items-center gap-4">
                <CustomInput
                  label="Account Name"
                  {...register("account_name", {
                    required: "Account name is required",
                  })}
                  error={errors.account_name?.message}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <InteractiveButton
                isLoading={submitLoading}
                className="flex-1"
                type="submit"
              >
                Add withdrawal account
              </InteractiveButton>
              <button
                type="button"
                onClick={handleAddCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
