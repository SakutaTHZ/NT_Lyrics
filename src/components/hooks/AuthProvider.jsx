import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "./authContext"; // ✅ Import AuthContext here

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/users/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const res = await response.json();

      console.log(res)

      if (res.token && res.user) {
        setUser(res.user);
        setToken(res.token);
        // console.log(res);
        const userDetails = {
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        }
        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("token", res.token);
        
        if(res.user.role === "admin"){
          navigate("/NT_Lyrics/admin");
        }else{
          navigate("/NT_Lyrics");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      return { success: false, message: err.message };
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/NT_Lyrics");
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