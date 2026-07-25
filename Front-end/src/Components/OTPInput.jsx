import { useRef } from "react";

function OTPInput({ otp, setOtp }) {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // User pasted multiple digits
    if (value.length > 1) {
      const digits = value.slice(0, 4).split("");

      const newOtp = ["", "", "", ""];

      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      setOtp(newOtp);

      inputRefs.current[Math.min(digits.length - 1, 3)]?.focus();

      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Backspace": {
        const newOtp = [...otp];

        if (otp[index]) {
          newOtp[index] = "";
          setOtp(newOtp);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }

        break;
      }

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        if (index < 3) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pasted) return;

    const newOtp = ["", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    inputRefs.current[Math.min(pasted.length - 1, 3)]?.focus();
  };

  return (
    <div className="my-8 flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="h-14 w-14 rounded-xl border border-gray-300 text-center text-2xl font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      ))}
    </div>
  );
}

export default OTPInput;
