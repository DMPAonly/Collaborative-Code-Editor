import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, resendOtp } from "../services/authService";
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

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

  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await resendOtp(email);

      setSuccess(response.message);

      // Clear previous OTP
      setOtp(["", "", "", ""]);

      // Reset attempts
      setAttemptsLeft(MAX_ATTEMPTS);

      // Restart timer
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to resend OTP. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };
  const handleVerify = async () => {
    if (timeLeft === 0) {
      setError("OTP has expired. Please resend a new OTP.");
      return;
    }

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyEmail({
        email,
        otp: enteredOtp,
      });

      setSuccess(response.message);

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Email verified successfully! Please login.",
          },
        });
      }, 1500);
    } catch (error) {
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
        error.response?.data?.message ||
          `Incorrect OTP. ${
            remainingAttempts
          } attempt${remainingAttempts > 1 ? "s" : ""} remaining.`,
      );

      setOtp(["", "", "", ""]);
    } finally {
      setIsVerifying(false);
    }
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
            disabled={isResending}
            className={`mt-2 font-medium ${
              isResending
                ? "cursor-not-allowed text-gray-400"
                : "text-blue-600 hover:underline"
            }`}
          >
            {isResending ? "Resending..." : "Resend OTP"}
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
      <Button
        type="button"
        onClick={handleVerify}
        disabled={timeLeft === 0 || isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </Button>
    </AuthLayout>
  );
}

export default VerifyEmail;
