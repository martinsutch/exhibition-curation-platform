import { useEffect, useState } from "react";
import { postUser, signInUser, signOutUser } from "../src/utils/api";

const AccountBox = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [userId, setUserId] = useState("");

  const handleCreateAccount = () => {
    postUser({ email: emailValue, password: passwordValue }).then(
      (response) => {
        console.log(response);
      }
    );
  };

  const handleSignIn = async () => {
    const response = await signInUser({
      email: emailValue,
      password: passwordValue,
    });
    console.log(response);
  };

  const handleSignOut = async () => {
    const response = await signOutUser();
    console.log(response);
    window.location.reload();
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

  return (
    <div className="block column single">
      <span>Account</span>
      <input
        className="accountInput"
        type="text"
        value={emailValue}
        placeholder="Email Address"
        onChange={handleEmailChange}
      />
      <input
        className="accountInput"
        type="password"
        value={passwordValue}
        placeholder="Password"
        onChange={handlePasswordChange}
      />
      <div className="card">
        <button onClick={handleCreateAccount}>Create Account</button>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <span>User id: {userId}</span>
    </div>
  );
};

export default AccountBox;
