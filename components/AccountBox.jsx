import { useEffect, useState } from "react";
import { postUser, signInUser, signOutUser } from "../src/utils/api";

const AccountBox = ({ setUserId, userId }) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCreateAccount = async () => {
    setIsWaiting(true);
    setErrorMessage("");
    if (!isValidEmail(emailValue)) {
      setErrorMessage("Please enter a valid email address.");
      setIsWaiting(false);
      return;
    }
    if (passwordValue.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsWaiting(false);
      return;
    }
    try {
      await postUser({
        email: emailValue,
        password: passwordValue,
      });
      await handleSignIn();
      setCreatingAccount(false);
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsWaiting(false);
    }
  };

  const handleSignIn = async () => {
    setIsWaiting(true);
    setErrorMessage("");
    if (!isValidEmail(emailValue)) {
      setErrorMessage("Please enter a valid email address.");
      setIsWaiting(false);
      return;
    }
    if (passwordValue.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsWaiting(false);
      return;
    }
    try {
      const response = await signInUser({
        email: emailValue,
        password: passwordValue,
      });
      if (!response || !response.user) {
        throw new Error();
      }
      setUserId(response.user.id);
    } catch (error) {
      if (error.status === 400) {
        setErrorMessage("Incorrect email/password. Try again.");
      } else {
        setErrorMessage(error.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setIsWaiting(false);
    }
  };

  const handleSignOut = async () => {
    setIsWaiting(true);
    setErrorMessage("");
    try {
      await signOutUser();
      window.location.reload();
    } catch (error) {
      setErrorMessage("Error signing out. Please try again.");
      setIsWaiting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };

  useEffect(() => {
    const retrievedId = localStorage.getItem("userId");
    setUserId(retrievedId);
  }, []);

  if (userId)
    return (
      <div className="block column single">
        <h2>Account</h2>
        <p>
          With your account, you can save your favourite finds into personalised
          collections, building your own <strong>Exhibit</strong> to showcase
          and curate.
        </p>
        <p>{errorMessage}</p>
        <button onClick={handleSignOut} disabled={isWaiting}>
          {isWaiting ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    );

  return (
    <div className="block column single">
      <h2>Account</h2>
      <div className="inputRow">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          className="otherInput"
          type="text"
          value={emailValue}
          placeholder="hello@exhibit.com"
          onChange={handleEmailChange}
          disabled={isWaiting}
        />
      </div>
      <div className="inputRow">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="otherInput"
          type="password"
          value={passwordValue}
          placeholder="••••••"
          onChange={handlePasswordChange}
          disabled={isWaiting}
        />
      </div>
      <div className="card column gap">
        {creatingAccount ? (
          <>
            <p>{errorMessage}</p>
            <button onClick={handleCreateAccount} disabled={isWaiting}>
              {isWaiting ? "Creating account..." : "Create Account"}
            </button>
            <span>
              Already got an account?{" "}
              <button
                className="textLink"
                onClick={() => setCreatingAccount(false)}
                disabled={isWaiting}
              >
                Log in
              </button>
            </span>
          </>
        ) : (
          <>
            <p>{errorMessage}</p>
            <button onClick={handleSignIn} disabled={isWaiting}>
              {isWaiting ? "Signing in..." : "Sign In"}
            </button>
            <span>
              New here?{" "}
              <button
                className="textLink"
                onClick={() => setCreatingAccount(true)}
                disabled={isWaiting}
              >
                Create an account
              </button>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountBox;
