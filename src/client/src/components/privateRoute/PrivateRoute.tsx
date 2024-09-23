<<<<<<< HEAD
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { loading, user } = useSelector((state: any) => state.user);

  return (
    <>
   
      {children}
    </>
=======
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
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  );
};


interface AdminOnlyRouteProps {
  children: ReactNode;
}

const AdminOnlyRoute: React.FC<AdminOnlyRouteProps> = ({ children }) => {
<<<<<<< HEAD
  const { loading, isAuthenticated, user } = useSelector((state: any) => state.user);
=======
  const { loading, isAuthenticated, user } = useSelector(
    (state: any) => state.user
  );
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e

  return (
    <>
      {(loading === false && !isAuthenticated) || !user?.username ? (
        <Navigate to="/login" />
<<<<<<< HEAD
      ) : user && user?.role !== 'FC:SUPER:ADMIN' ? (
        <>
          <h3 style={{ textAlign: 'center' }}>Unauthorized Access!!</h3>
          <Link to="/">
            <p
              style={{
                textAlign: 'center',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#176984',
=======
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
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
              }}
            >
              Go Home
            </p>
          </Link>
        </>
<<<<<<< HEAD
      ) : user && user?.role === 'FC:SUPER:ADMIN' && children}
=======
      ) : (
        user && user?.role === "FC:SUPER:ADMIN" && children
      )}
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    </>
  );
};

<<<<<<< HEAD
export { AdminOnlyRoute, PrivateRoute}
=======
export { AdminOnlyRoute, PrivateRoute };
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
