import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import useKycStore from "../../store/kycStore";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiLocationMarker } from "react-icons/hi";

// Form validation schema
const tier2Schema = yup.object().shape({
  // Address fields
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postal_code: yup.string().required("Postal code is required"),
  country: yup.string().default("Nigeria"),
});

export default function Tier2Verification({ kycStatus }) {
  const { submitTier2Verification, isLoading } = useKycStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(tier2Schema),
    defaultValues: {
      street: kycStatus?.tier2?.address?.street || "",
      city: kycStatus?.tier2?.address?.city || "",
      state: kycStatus?.tier2?.address?.state || "",
      postal_code: kycStatus?.tier2?.address?.postal_code || "",
      country: "Nigeria",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
        },
      };

      await submitTier2Verification(formattedData);
    } catch (error) {
      console.error("Error submitting Tier 2 verification:", error);
    }
  };

  const isTier2Verified = kycStatus?.tier2?.status === "verified";
  const isTier2Pending = kycStatus?.tier2?.status === "pending";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tier 2: Address Verification
      </h2>
      <p className="text-gray-600 mb-6">
        Verify your address to complete Tier 2 verification.
      </p>

      {isTier2Verified ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <div className="flex items-center">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium">
              Tier 2 verification completed successfully!
            </p>
          </div>
          {kycStatus?.tier2?.completed_at && (
            <p className="mt-1 text-sm">
              Completed on:{" "}
              {new Date(kycStatus.tier2.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : isTier2Pending ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
          <p className="font-medium">
            Your Tier 2 verification is pending review.
          </p>
          <p className="mt-1 text-sm">
            We&apos;ll notify you once the verification is complete. This
            usually takes 24-48 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <HiLocationMarker className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium">Address Information</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.street ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("street")}
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("city")}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("state")}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postal Code
                </label>
                <input
                  id="postal_code"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.postal_code ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("postal_code")}
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                value="Nigeria"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div className="flex justify-end mt-4">
              <InteractiveButton
                type="submit"
                isLoading={isLoading}
                className="px-4 py-2"
              >
                Submit Verification
              </InteractiveButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// PropTypes validation
Tier2Verification.propTypes = {
  kycStatus: PropTypes.shape({
    tier2: PropTypes.shape({
      status: PropTypes.string,
      completed_at: PropTypes.string,
      address: PropTypes.shape({
        street: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        postal_code: PropTypes.string,
      }),
    }),
  }),
};

// Default props
Tier2Verification.defaultProps = {
  kycStatus: {
    tier2: {
      status: "",
      address: {
        street: "",
        city: "",
        state: "",
        postal_code: "",
      },
    },
  },
};
