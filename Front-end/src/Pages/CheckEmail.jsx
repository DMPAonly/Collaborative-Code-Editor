import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/Button";

function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const message =
    location.state?.message ||
    "If an account with this email exists, we've sent a password reset link.";

  return (
    <AuthLayout title="Check Your Email" subtitle="Password Reset Link Sent">
      <div className="text-center">
        <div className="mb-6 text-6xl">📧</div>

        <p className="text-gray-600 leading-7">{message}</p>

        {email && <p className="mt-2 font-medium text-gray-700">{email}</p>}

        <p className="mt-4 text-sm text-gray-500">
          Please check your inbox and spam folder.
        </p>

        <div className="mt-8">
          <Button onClick={() => navigate("/login")}>Back to Login</Button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default CheckEmail;
