import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label className="block w-full text-left text-sm font-medium mb-2 text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg px-4 py-3 outline-none transition duration-200
            ${
              error
                ? "border border-red-500 focus:border-red-500"
                : "border border-gray-300 focus:border-blue-500"
            }`}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default InputField;
