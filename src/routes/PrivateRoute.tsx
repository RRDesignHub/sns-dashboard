import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { loader, user } = useAuth();
  const location = useLocation();

  if (loader) {
    return <Loading />;
  }

  return user ? (
    children
  ) : (
    <Navigate state={location.pathname} to="/login"></Navigate>
  );
};
