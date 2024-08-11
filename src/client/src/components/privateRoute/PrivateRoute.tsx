import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { RootState } from "../../store.js";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user);

  return user?.username ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};


interface AdminOnlyRouteProps {
  children: ReactNode;
}

const AdminOnlyRoute: React.FC<AdminOnlyRouteProps> = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector(
    (state: any) => state.user
  );

  return (
    <>
      {(loading === false && !isAuthenticated) || !user?.username ? (
        <Navigate to="/login" />
      ) : user && user?.role !== "FC:SUPER:ADMIN" ? (
        <>
          <h3 style={{ textAlign: "center" }}>Unauthorized Access!!</h3>
          <Link to="/">
            <p
              style={{
                textAlign: "center",
                fontWeight: 600,
                cursor: "pointer",
                color: "#176984",
              }}
            >
              Go Home
            </p>
          </Link>
        </>
      ) : (
        user && user?.role === "FC:SUPER:ADMIN" && children
      )}
    </>
  );
};

export { AdminOnlyRoute, PrivateRoute };
