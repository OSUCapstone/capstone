import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import {
  Footnote,
  Heading,
  SubHeading,
  TextInput,
  Button,
} from "../components";
import { createAccount, login } from "../requests";
import Routes from "../Routes";

const SignupPage = withRouter(({ match, history, location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    if (!(username && password && confirmPassword)) {
      setErrorMessage("Please fill out all fields to signup");
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage("Please make sure your passwords match");
      return;
    } else {
      try {
        await createAccount(username, password);
        await handleLogin();
      } catch (err) {
        console.log(err);
        setErrorMessage(
          "An error occurred during sigup. Please make sure you've entered valid values in all fields"
        );
      }
    }
  };

  const handleLogin = async () => {
    try {
      let res = await login(username, password);
      localStorage.setItem("access_token", res.data);
      history.push(Routes.JOBS_PAGE);
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "An error occurred during login. Please make sure you've entered valid account credentials"
      );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="absolute top-5 left-5">
        <Heading>Job Tracker</Heading>
      </div>
      <Heading>Sign Up</Heading>
      <SubHeading>
        ...and get started on your journey towards employment 😁
      </SubHeading>
      <div className="my-2">
        <TextInput
          value={username}
          setValue={setUsername}
          placeholder="Enter a username..."
        />
      </div>
      <div className="my-2">
        <TextInput
          value={password}
          setValue={setPassword}
          placeholder="Enter a password..."
          type="password"
        />
      </div>
      <div className="my-2">
        <TextInput
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="Confirm your password..."
          type="password"
        />
      </div>
      <div className="my-2">
        <Button onClick={handleSignUp}>Submit</Button>
      </div>
      <Footnote
        unlinkedText="Already have an account?"
        linkedText="Log in here!"
        onClickLink={() => history.push(Routes.LOGIN_PAGE)}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 mt-2 w-80 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default SignupPage;
