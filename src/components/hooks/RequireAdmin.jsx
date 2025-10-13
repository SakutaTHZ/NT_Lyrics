import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/NT_Lyrics/admin", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdmin;
