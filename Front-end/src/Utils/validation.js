export const validateSignup = (formData) => {
  const errors = {};

  // Username
  if (!formData.username.trim()) {
    errors.username = "Username is required.";
  } else if (formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email.";
  }

  // Password
  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      formData.password,
    )
  ) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character.";
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateForgotPassword = (email) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
};
