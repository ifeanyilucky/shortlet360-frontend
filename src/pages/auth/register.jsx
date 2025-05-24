import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import InteractiveButton from "../../components/InteractiveButton";
import { FiHome, FiEye, FiEyeOff } from "react-icons/fi";
import { MdApartment } from "react-icons/md";

// Update validation schema
const schema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register: registerUser } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("user");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    try {
      setSubmitLoading(true);
      await registerUser({
        ...data,
        role: selectedTab === "user" ? "user" : "owner",
      });

      if (selectedTab === "owner") {
        // The register function in JWTContext will handle redirection to payment page
        toast.success(
          "Registration successful! Please complete your payment to activate your account."
        );
      } else {
        toast.success("Registration successful!");
      }

      // No need to navigate here as JWTContext will handle it
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-4xl font-medium mb-2">Create an account</h1>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary-500 hover:underline">
              Log in
            </Link>
          </p>
          {selectedTab === "owner" && (
            <p className="text-sm text-orange-600 mt-2">
              Note: A one-time registration fee will be required to activate
              your account after registration.
            </p>
          )}
        </div>

        {/* Custom tabs using Tailwind */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2 text-gray-700">
            I want to register as:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200
                ${
                  selectedTab === "user"
                    ? "border-accent-500 bg-accent-50 shadow-md"
                    : "border-gray-200 hover:border-accent-300 hover:bg-accent-50"
                }`}
              onClick={() => setSelectedTab("user")}
            >
              <div
                className={`p-3 rounded-full mb-2 ${
                  selectedTab === "user"
                    ? "bg-accent-500 text-white"
                    : "bg-accent-100 text-accent-600"
                }`}
              >
                <FiHome size={24} />
              </div>
              <span className="font-medium text-base mb-1">
                Rental/Shortlet
              </span>
              <p className="text-xs text-gray-500 text-center">
                I want to rent or book properties
              </p>
            </button>
            <button
              type="button"
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200
                ${
                  selectedTab === "owner"
                    ? "border-primary-500 bg-primary-50 shadow-md"
                    : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                }`}
              onClick={() => setSelectedTab("owner")}
            >
              <div
                className={`p-3 rounded-full mb-2 ${
                  selectedTab === "owner"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <MdApartment size={24} />
              </div>
              <span className="font-medium text-base mb-1">
                Landlord/Property Manager
              </span>
              <p className="text-xs text-gray-500 text-center">
                I want to list my properties/Get them Managed by Aplet360
              </p>
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="Enter your first name"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.first_name ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.last_name ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {selectedTab === "owner" && (
            <div className="space-y-2">
              <label
                htmlFor="business_name"
                className="text-sm font-medium text-gray-700"
              >
                Business Name
              </label>
              <input
                id="business_name"
                type="text"
                placeholder="Enter your business name (Optional)"
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register("business_name")}
              />
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-accent-600 font-medium hover:underline"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-accent-600 font-medium hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <InteractiveButton
            className="w-full py-3 text-base font-medium"
            type="submit"
            variant="accent"
            size="large"
            isLoading={submitLoading}
            disabled={!agreed}
          >
            {submitLoading ? "Creating Account..." : "Create Account"}
          </InteractiveButton>
        </form>
      </div>
    </div>
  );
}
