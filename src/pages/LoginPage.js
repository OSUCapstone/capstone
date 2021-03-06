import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import {
  Heading,
  SubHeading,
  TextInput,
  Footnote,
  Button,
} from "../components";
import { login } from "../requests";
import Routes from "../Routes";

const LoginPage = withRouter(({ match, history, location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!(username && password)) {
      setErrorMessage(
        "Please fill out both fields with valid credentials to login"
      );
      return;
    }
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

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="absolute top-5 left-5">
        <Heading>Job Tracker</Heading>
      </div>
      <Heading>Log In</Heading>
      <SubHeading>
        ...and get back to work on your journey towards employment!
      </SubHeading>
      <div className="my-2">
        <TextInput
          value={username}
          setValue={setUsername}
          placeholder="Enter your username..."
        />
      </div>
      <div className="my-2">
        <TextInput
          value={password}
          setValue={setPassword}
          placeholder="Enter your password..."
          type="password"
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="my-2">
        <Button onClick={handleLogin}>Login</Button>
      </div>
      <Footnote
        unlinkedText="Don't have an account yet?"
        linkedText="Sign up here!"
        onClickLink={() => history.push(Routes.SIGNUP_PAGE)}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 mt-2 w-80 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default LoginPage;
