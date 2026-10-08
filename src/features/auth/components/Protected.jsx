import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from "react";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="size-8 animate-spin rounded-full border-2 border-ink-700 border-t-brand-400" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
