import { useState } from "react";
import "./Registration.css";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // PASSWORD STRENGTH
  // ==========================================

  const getPasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        text: "",
      };
    }

    let score = 0;

    // At least 8 characters
    if (password.length >= 8) {
      score++;
    }

    // Uppercase
    if (/[A-Z]/.test(password)) {
      score++;
    }

    // Lowercase
    if (/[a-z]/.test(password)) {
      score++;
    }

    // Number
    if (/[0-9]/.test(password)) {
      score++;
    }

    // Special character
    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 2) {
      return {
        score,
        text: "Weak",
      };
    }

    if (score <= 4) {
      return {
        score,
        text: "Medium",
      };
    }

    return {
      score,
      text: "Strong",
    };
  };

  const passwordStrength = getPasswordStrength(
    formData.password
  );


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    let updatedErrors = {
      ...errors,
      [name]: "",
    };


    // ==========================================
    // PASSWORD VALIDATION WHILE TYPING
    // ==========================================

    if (name === "password") {

      if (value.length > 0 && value.length < 8) {
        updatedErrors.password =
          "Password must contain at least 8 characters.";
      }

      // Check confirm password if already entered
      if (
        updatedFormData.confirmPassword !== "" &&
        value !== updatedFormData.confirmPassword
      ) {
        updatedErrors.confirmPassword =
          "Passwords do not match.";
      } else if (
        updatedFormData.confirmPassword !== "" &&
        value === updatedFormData.confirmPassword
      ) {
        updatedErrors.confirmPassword = "";
      }
    }


    // ==========================================
    // CONFIRM PASSWORD MATCH
    // ==========================================

    if (name === "confirmPassword") {

      if (
        value !== "" &&
        value !== updatedFormData.password
      ) {
        updatedErrors.confirmPassword =
          "Passwords do not match.";
      } else {
        updatedErrors.confirmPassword = "";
      }
    }


    setErrors(updatedErrors);

    setSuccessMessage("");
  };


  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};


    // ------------------------------------------
    // NAME
    // ------------------------------------------

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Name must contain at least 3 characters.";
    }


    // ------------------------------------------
    // EMAIL
    // ------------------------------------------

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }


    // ------------------------------------------
    // MOBILE
    // ------------------------------------------

    if (!formData.mobile.trim()) {
      newErrors.mobile =
        "Mobile number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.mobile
      )
    ) {
      newErrors.mobile =
        "Enter a valid 10-digit mobile number.";
    }


    // ------------------------------------------
    // PASSWORD
    // ------------------------------------------

    if (!formData.password) {

      newErrors.password =
        "Password is required.";

    } else {

      if (formData.password.length < 8) {
        newErrors.password =
          "Password must contain at least 8 characters.";
      }

      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter.";
      }

      if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter.";
      }

      if (!/[0-9]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one number.";
      }

      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one special character.";
      }
    }


    // ------------------------------------------
    // CONFIRM PASSWORD
    // ------------------------------------------

    if (!formData.confirmPassword) {

      newErrors.confirmPassword =
        "Please confirm your password.";

    } else if (
      formData.password !==
      formData.confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match.";
    }


    return newErrors;
  };


  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = (event) => {

    event.preventDefault();

    setSuccessMessage("");

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {

      setErrors(validationErrors);

      return;
    }


    // Registration successful

    setErrors({});

    setSuccessMessage(
      "Registration successful!"
    );

    console.log(
      "Registration Data:",
      formData
    );
  };


  return (
    <div className="registration-page">

      <div className="registration-card">

        <h1>Create Account</h1>

        <p className="subtitle">
          Register to access the system
        </p>


        <form onSubmit={handleSubmit}>

          {/* =====================================
              NAME
          ====================================== */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            {errors.name && (
              <p className="error">
                {errors.name}
              </p>
            )}

          </div>


          {/* =====================================
              EMAIL
          ====================================== */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="error">
                {errors.email}
              </p>
            )}

          </div>


          {/* =====================================
              MOBILE
          ====================================== */}

          <div className="form-group">

            <label htmlFor="mobile">
              Mobile Number
            </label>

            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />

            {errors.mobile && (
              <p className="error">
                {errors.mobile}
              </p>
            )}

          </div>


          {/* =====================================
              PASSWORD
          ====================================== */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-container">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>


            {/* =================================
                PASSWORD STRENGTH
            ================================== */}

            {formData.password && (

              <div className="password-strength">

                <div className="strength-bar">

                  <div
                    className={`strength-progress strength-${passwordStrength.text.toLowerCase()}`}
                    style={{
                      width: `${
                        passwordStrength.score * 20
                      }%`,
                    }}
                  ></div>

                </div>

                <p
                  className={`strength-text strength-${passwordStrength.text.toLowerCase()}`}
                >
                  Password Strength:
                  {" "}
                  {passwordStrength.text}
                </p>

              </div>

            )}


            {/* Password Requirements */}

            {formData.password && (

              <div className="password-requirements">

                <p
                  className={
                    formData.password.length >= 8
                      ? "valid"
                      : "invalid"
                  }
                >
                  {formData.password.length >= 8
                    ? "✓"
                    : "✗"}{" "}
                  At least 8 characters
                </p>

                <p
                  className={
                    /[A-Z]/.test(formData.password)
                      ? "valid"
                      : "invalid"
                  }
                >
                  {/[A-Z]/.test(formData.password)
                    ? "✓"
                    : "✗"}{" "}
                  One uppercase letter
                </p>

                <p
                  className={
                    /[a-z]/.test(formData.password)
                      ? "valid"
                      : "invalid"
                  }
                >
                  {/[a-z]/.test(formData.password)
                    ? "✓"
                    : "✗"}{" "}
                  One lowercase letter
                </p>

                <p
                  className={
                    /[0-9]/.test(formData.password)
                      ? "valid"
                      : "invalid"
                  }
                >
                  {/[0-9]/.test(formData.password)
                    ? "✓"
                    : "✗"}{" "}
                  One number
                </p>

                <p
                  className={
                    /[^A-Za-z0-9]/.test(
                      formData.password
                    )
                      ? "valid"
                      : "invalid"
                  }
                >
                  {/[^A-Za-z0-9]/.test(
                    formData.password
                  )
                    ? "✓"
                    : "✗"}{" "}
                  One special character
                </p>

              </div>

            )}


            {errors.password && (
              <p className="error">
                {errors.password}
              </p>
            )}

          </div>


          {/* =====================================
              CONFIRM PASSWORD
          ====================================== */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-container">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                id="confirmPassword"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm your password"
              />

              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>


            {/* Password Match */}

            {formData.confirmPassword && (
              <p
                className={
                  formData.password ===
                  formData.confirmPassword
                    ? "password-match"
                    : "password-not-match"
                }
              >
                {formData.password ===
                formData.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}


            {errors.confirmPassword && (
              <p className="error">
                {errors.confirmPassword}
              </p>
            )}

          </div>


          {/* =====================================
              SUCCESS MESSAGE
          ====================================== */}

          {successMessage && (
            <p className="success-message">
              {successMessage}
            </p>
          )}


          {/* =====================================
              REGISTER BUTTON
          ====================================== */}

          <button
            type="submit"
            className="register-button"
          >
            Register
          </button>

        </form>


        {/* =====================================
            LOGIN LINK
        ====================================== */}

        <p className="login-link">

          Already have an account?

          <a href="#">
            Login
          </a>

        </p>

      </div>

    </div>
  );
}

export default Registration;