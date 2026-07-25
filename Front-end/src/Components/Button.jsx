function Button({ children, type = "button", onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg py-3 font-semibold transition
        ${
          disabled
            ? "cursor-not-allowed bg-gray-400 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
    >
      {children}
    </button>
  );
}

export default Button;