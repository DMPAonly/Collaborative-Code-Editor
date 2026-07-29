import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import { validateForgotPassword } from "../Utils/validation";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    const validationErrors = validateForgotPassword(value);

    setErrors({
      email: validationErrors.email || "",
    });

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForgotPassword(email);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);

      navigate("/check-email", {
        state: {
          email,
          message: response.message,
        },
      });
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Unable to send reset link. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your registered email address"
    >
      <form onSubmit={handleSubmit} className="text-left">
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          error={errors.email}
        />
        {apiError && (
          <p className="mb-4 text-center text-sm text-red-500">{apiError}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
