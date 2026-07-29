import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateLogin } from "../Utils/validation";
import { login } from "../services/authService";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    const validationErrors = validateLogin(updatedForm);

    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name] || "",
    }));

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setIsLoading(true);

    try {
      const response = await login(formData);

      // Later we'll store JWT here
      // localStorage.setItem("token", response.token);

      navigate("/editor");
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Welcome back! Login to continue">
      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="text-left">
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="mb-5 text-right">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        {apiError && (
          <p className="mb-4 text-center text-sm text-red-500">{apiError}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging In..." : "Login"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-500">Don't have an account?</span>

        <button
          type="button"
          className="ml-2 text-blue-600 hover:underline"
          onClick={() => navigate("/")}
        >
          Sign Up
        </button>
      </div>
    </AuthLayout>
  );
}

export default Login;
