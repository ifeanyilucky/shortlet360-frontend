import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import InteractiveButton from "../../components/InteractiveButton";
import { Icon } from "@iconify/react/dist/iconify.js";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
});

export default function ForgotPassword() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      await forgotPassword(data);
      setEmailSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error - Please check your internet connection");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      setSubmitLoading(true);
      await forgotPassword({ email });
      toast.success("Password reset link sent again");
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to resend email. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Icon 
                icon="heroicons:check-circle" 
                className="w-8 h-8 text-green-600" 
              />
            </div>
            <h1 className="text-4xl font-medium mb-2">Check your email</h1>
            <p className="text-gray-600">
              We've sent a password reset link to{" "}
              <span className="font-medium text-gray-900">
                {getValues("email")}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or click below to resend.
            </p>
          </div>

          <div className="space-y-4">
            <InteractiveButton
              onClick={handleResendEmail}
              variant="outline"
              isLoading={submitLoading}
              className="w-full py-3 text-base font-medium"
              size="large"
            >
              {submitLoading ? "Resending..." : "Resend email"}
            </InteractiveButton>

            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Icon icon="heroicons:arrow-left" className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-4xl font-medium mb-2">Forgot your password?</h1>
          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              } focus:outline-none focus:ring-2 focus:ring-accent-500`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <InteractiveButton
            type="submit"
            variant="accent"
            isLoading={submitLoading}
            className="w-full py-3 text-base font-medium"
            size="large"
          >
            {submitLoading ? "Sending..." : "Send reset link"}
          </InteractiveButton>
        </form>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Icon icon="heroicons:arrow-left" className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
