import { useState } from "react";
import { useNavigate } from "react-router-dom";

function useLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    return;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    // ────────────────────────────────────────────────
    //    DEVELOPMENT / DEMO MODE (Frontend-only)
    //    Remove or comment out when backend is ready
    // ────────────────────────────────────────────────
    const USE_DEMO_MODE = true; // ← Change to false when you have backend

    if (USE_DEMO_MODE) {
      // Fake delay + simple validation
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      setSuccess("Login successfully! (Demo Mode)");
      setIsLoading(false);
      setTimeout(() => navigate("/Dashboard"), 800);
      return;
    }

    // ────────────────────────────────────────────────
    //    REAL BACKEND LOGIN (uncomment when ready)
    // ────────────────────────────────────────────────
    /*
    try {
      const response = await fetch('https://your-api.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Success - save token & redirect
      localStorage.setItem('token', data.token);
      // Optional: save user info
      // localStorage.setItem('user', JSON.stringify(data.user));
      
      setSuccess('Login successful!');
      navigate('/Dashboard'); // or your protected route

    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
    */
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    success,
    setSuccess,
    error,
    isLoading,
    handleLogin,
    togglePasswordVisibility,
  };
}

export default useLogin;
