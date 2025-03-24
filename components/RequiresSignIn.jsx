import React, { useState, useEffect } from "react";
import { checkSignedIn } from "../src/utils/api";
import { useLocation, useNavigate } from "react-router-dom";

const RequiresSignIn = ({ children, userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isItemPage = location.pathname.startsWith("/id/");

  useEffect(() => {
    const timeout = setTimeout(() => setIsTimeout(true), 2000);

    const checkSignInStatus = async () => {
      try {
        const result = await checkSignedIn();
        setIsSignedIn(true);
        setIsLoading(false);
      } catch (error) {
        setIsSignedIn(false);
        setIsLoading(false);
      } finally {
        clearTimeout(timeout);
      }
    };

    checkSignInStatus();

    return () => clearTimeout(timeout);
  }, [userId]);

  if (isLoading) {
    if (isTimeout) {
      return (
        <div className="block single row">
          <p>
            Welcome to ExhiBit. It can take around 50 seconds for the servers to
            spin up. Please wait...
          </p>
        </div>
      );
    } else {
      return (
        <div className="block single row">
          <p>Loading...</p>
        </div>
      );
    }
  }

  if (isSignedIn) {
    return <>{children}</>;
  }

  return (
    <div className="block single row">
      {isItemPage ? (
        <>
          <p>
            Add this artwork to your own collection. Head to the account page to
            sign in.
          </p>
          <button onClick={() => navigate("../../account")}>
            Go to Account
          </button>
        </>
      ) : (
        <p>Sign in to view and edit your own collections.</p>
      )}
    </div>
  );
};

export default RequiresSignIn;
