import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import OTPInput from "../components/OTPInput";
import Button from "../components/Button";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const MAX_ATTEMPTS = 3;

  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResendOtp = () => {
    // Later this will call the backend API
    // Example:
    // await resendOtp(email);

    console.log("Resending OTP...");

    // Clear previous OTP
    setOtp(["", "", "", ""]);

    // Clear previous messages
    setError("");
    setSuccess("");

    // Reset attempts
    setAttemptsLeft(MAX_ATTEMPTS);

    // Restart timer
    setTimeLeft(60);
    setCanResend(false);
  };

  const handleVerify = () => {
    if (timeLeft === 0) {
      setError("OTP has expired. Please resend a new OTP.");
      return;
    }

    const enteredOtp = otp.join("");

    if (enteredOtp === "1234") {
      setSuccess("Email verified successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return;
    }

    const remainingAttempts = attemptsLeft - 1;

    if (remainingAttempts === 0) {
      setError("Too many failed attempts. Redirecting to Sign Up...");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      return;
    }

    setAttemptsLeft(remainingAttempts);

    setError(
      `Incorrect OTP. ${
        remainingAttempts
      } attempt${remainingAttempts > 1 ? "s" : ""} remaining.`,
    );

    setOtp(["", "", "", ""]);
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle={`We've sent a 4-digit verification code to ${email}`}
    >
      <OTPInput otp={otp} setOtp={setOtp} />
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-500">Didn't receive the code?</p>

        {canResend ? (
          <button
            type="button"
            onClick={handleResendOtp}
            className="mt-2 font-medium text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Resend OTP in{" "}
            <span className="font-semibold text-blue-600">
              {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
                timeLeft % 60,
              ).padStart(2, "0")}`}
            </span>
          </p>
        )}
      </div>
      {success && (
        <p className="mt-4 text-center text-green-600 font-medium">
          ✅ {success}
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      )}
      <Button type="button" onClick={handleVerify} disabled={timeLeft === 0}>
        Verify
      </Button>
    </AuthLayout>
  );
}

export default VerifyEmail;
