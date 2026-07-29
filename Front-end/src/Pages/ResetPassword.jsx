import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { validateSignup } from "../Utils/validation";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  console.log("Reset Token:", token);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    const validationErrors = validateSignup({
      username: "dummy",
      email: "dummy@gmail.com",
      password: updatedForm.password,
      confirmPassword: updatedForm.confirmPassword,
    });

    setErrors({
      password: validationErrors.password || "",
      confirmPassword: validationErrors.confirmPassword || "",
    });

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignup({
      username: "dummy",
      email: "dummy@gmail.com",
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setIsLoading(true);

    try {
      const response = await resetPassword({
        token,
        password: formData.password,
      });

      setSuccess(response.message);

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Password updated successfully. Please login.",
          },
        });
      }, 1500);
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Choose a new password for your account"
    >
      <form onSubmit={handleSubmit} className="text-left">
        <InputField
          label="New Password"
          type="password"
          name="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        {apiError && (
          <p className="mb-4 text-center text-red-500">{apiError}</p>
        )}
        {success && (
          <p className="mb-4 text-center font-medium text-green-600">
            ✅ {success}
          </p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
