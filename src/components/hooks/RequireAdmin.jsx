import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthProvider";
import PropTypes from "prop-types";

const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);

  console.log("RequireAdmin user", user);

  if (!user) return <Navigate to="/NT_Lyrics" replace />;
  if (user.role !== "admin") return <Navigate to="/NT_Lyrics" replace />;

  return children;
};

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdmin;
