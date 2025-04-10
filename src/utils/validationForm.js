export const validationForm = (formData) => {
  const errors = {};

  if (!/^[a-zA-Z]{2,}$/.test(formData.first_name)) {
    errors.first_name =
      "First name must contain only alphabets and be at least 2 characters.";
  }
  if (!/^[a-zA-Z]{2,}$/.test(formData.last_name)) {
    errors.last_name =
      "Last name must contain only alphabets and be at least 2 characters.";
  }

  // Phone number validation (10 digits)
  if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = "Phone number must be 10 digits.";
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format.";
  }
  // Date of birth validation (cannot be today or in the future)
  const currentDate = new Date().toISOString().split("T")[0];
  if (!formData.dob || formData.dob >= currentDate) {
    errors.dob = "Date of birth must be in the past.";
  }

  // Password validation (min 6 characters, at least one number, one uppercase, and one special character)
  if (
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(
      formData.password
    )
  ) {
    errors.password =
      "Password must be at least 6 characters, include one uppercase letter, one number, and one special character.";
  }

  return errors;
};
