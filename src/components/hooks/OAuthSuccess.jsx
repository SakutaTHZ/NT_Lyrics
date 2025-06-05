import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/hooks/AuthProvider"; // adjust path as needed

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext); // Expose setters if not already

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // If token and user are already stored in localStorage, skip setting again
    if (token && user) {
      navigate(user.role === "admin" ? "/NT_Lyrics/admin" : "/NT_Lyrics/");
      return;  // Prevent further execution if data is already set
    }

    // Otherwise, proceed with OAuth logic
    const query = new URLSearchParams(window.location.search);
    const newToken = query.get("token");
    const encodedUser = query.get("user");

    if (newToken && encodedUser) {
      try {
        const userStr = atob(encodedUser);
        const userObj = JSON.parse(userStr);

        // Store token and user in localStorage
        localStorage.setItem("token", newToken);
        const userDetails = {
          id: userObj._id,
          name: userObj.name,
          email: userObj.email,
          role: userObj.role,
          isOAuth: true,
        };
        localStorage.setItem("user", JSON.stringify(userDetails));

        // Update context state
        setToken(newToken);
        setUser(userObj);

        // Redirect based on role
        navigate(userObj.role === "admin" ? "/NT_Lyrics/admin" : "/NT_Lyrics/");
      } catch (error) {
        console.error('Error decoding or parsing user data:', error);
        navigate("/login");
      }
    } else {
      console.error("Invalid OAuth redirect data");
      navigate("/login");
    }
  }, [navigate, setToken, setUser]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-xl font-bold">Logging you in via Google...</h2>
    </div>
  );
};

export default OAuthSuccess;
