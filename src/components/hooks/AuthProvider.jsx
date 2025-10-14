import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { apiUrl } from "../../assets/util/api"; // Ensure this path is correct
// 🛑 IMPORT ONLY AuthContext from the separate definition file
import { AuthContext } from "./authContext";

// --- 1. Robust Validation Function (Kept outside the component) ---

/**
 * Validates the user's token against the backend and fetches the profile.
 * Handles specific error codes (401, 403) and throws structured errors.
 */
export const validateUser = async (id, token) => {
  if (!id || !token) {
    throw { customError: { status: 401, message: "No active session found." } };
  }
  try {
    const response = await fetch(`${apiUrl}/users/userProfile/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const status = response.status;
      let message = "Unexpected error. Please try again.";
      if (status === 401) {
        message = "Session expired or invalid. Please log in again.";
      } else if (status === 403) {
        message = "Your account has been deactivated or you don’t have access.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      }
      throw { response, customError: { status, message } };
    }
    // Success: return the profile data
    return response.json();
  } catch (err) {
    if (!err.customError) {
      // Catches network or JSON parsing errors
      throw {
        customError: {
          status: 500,
          message: "Network error or data parsing failure.",
        },
      };
    }
    throw err;
  }
};

// --- 2. The Auth Provider Component ---

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // State for expired token messages
  const navigate = useNavigate();

  // Helper to get user ID safely from local storage for validation
  const getStoredUserId = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser).id;
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
    return null;
  };

  // --- EFFECT: Initial Session Validation on Mount (using validateUser) ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedId = getStoredUserId();

    if (storedToken && storedId) {
      const validateSession = async () => {
        setIsLoading(true);
        setAuthError(null);
        try {
          // Call YOUR robust validation function
          const freshData = await validateUser(storedId, storedToken);

          // Success: Update state with validated data
          setUser(freshData.user); // Assuming validated response has a 'user' field
          setToken(storedToken);
        } catch (error) {
          const { status, message } = error.customError || {
            status: 500,
            message: "Unknown validation error.",
          };
          console.error("Session validation failed:", status, message);

          if (status === 401 || status === 403) {
            setAuthError(message); // Store the "Token expired" message
            logOut(false); // Clean up state without navigation
          }
        } finally {
          setIsLoading(false);
        }
      };
      validateSession();
    } else {
      // No credentials to check
      setIsLoading(false);
    }
  }, []); // Run only on mount

  // --- Actions ---

  const loginAction = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/users/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if the errorData has the nested structure or a simple message
        const errorMessage =
          errorData.errors?.[0]?.message ||
          errorData.message ||
          "Login failed.";
        throw new Error(errorMessage);
      }

      const res = await response.json();

      console.log("Login response:", res); // Debug log

      if (res.token && res.user) {
        const userDetails = {
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          isOAuth: false,
        };

        // Set state and local storage
        setUser(userDetails); // Use validated/parsed user details
        setToken(res.token);
        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("token", res.token);
        localStorage.setItem("language", "my");
        setAuthError(null); // Clear any previous errors

        // Navigation logic
        if (res.user.role === "admin") {
          navigate("/NT_Lyrics/admin");
        } else {
          navigate("/");
        }
        return { success: true };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  // logOut takes a flag to prevent navigation on failed token validation
  const logOut = (shouldNavigate = true) => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthError(null); // Clear error on intentional log out
    if (shouldNavigate) {
      navigate("/");
    }
  };

  const value = {
    token,
    user,
    loginAction,
    logOut,
    setToken,
    setUser,
    isLoading,
    authError, // Expose authError for displaying the "expired token" message
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Optional: Show a loading state while validating the session */}
      {isLoading ? <div></div> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
