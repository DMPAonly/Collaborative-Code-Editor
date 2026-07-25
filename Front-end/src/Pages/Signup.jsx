import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { validateSignup } from "../Utils/validation";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    navigate("/verify-email", {
      state: {
        email: formData.email,
      },
    });
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to start collaborating"
    >
      <form onSubmit={handleSubmit} className="text-left">
        <InputField
          label="Username"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit">Sign Up</Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-gray-500">Already have an account?</span>

        <button
          type="button"
          className="ml-2 text-blue-600 hover:underline"
          onClick={() =>
            navigate("/login", {
              state: {
                email: formData.email,
              },
            })
          }
        >
          Login
        </button>
      </div>
    </AuthLayout>
  );
}

export default Signup;
