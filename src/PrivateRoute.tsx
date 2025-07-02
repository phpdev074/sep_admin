// components/PrivateRoute.tsx or .jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
