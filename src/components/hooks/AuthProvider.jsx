import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "./authContext"; // ✅ Import AuthContext here
import { apiUrl } from "../../assets/util/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginAction = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/users/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors[0].message);
      }

      const res = await response.json();


      if (res.token && res.user) {
        setUser(res.user);
        setToken(res.token);
        const userDetails = {
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          isOAuth: false,
        }
        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("token", res.token);
        
        localStorage.setItem("language", "myanmar");
        localStorage.setItem("theme", "light");
        
        if(res.user.role === "admin"){
          navigate("/NT_Lyrics/admin");
        }else{
          navigate("/");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, message: err.message };
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
export { AuthContext }; 