import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthProvider";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/NT_Lyrics/admin", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return <Navigate to="/NT_Lyrics" replace />;
  if (user.role !== "admin") return <Navigate to="/NT_Lyrics" replace />;

  return children;
};

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdmin;
