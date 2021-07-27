import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import {
  Heading,
  TextInput,
  Button,
} from "../components";
import { deleteJob, updateJob } from "../requests";
import Routes from "../Routes";

const JobPage = withRouter(({ match, history, location }) => {
  const handleDeleteJob = async () => {
    try {
      await deleteJob('testId');
      history.push(Routes.JOB_PAGE);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateJob = async () => {
    try {
      await updateJob('testId', '1', '3', '3', '3', '3');
      history.push(Routes.JOB_PAGE);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="absolute top-5 left-5">
        <Heading>Job Tracker</Heading>
      </div>
      <Heading>Job Page</Heading>
      <div className="my-2">
        <Button onClick={handleDeleteJob}>Delete Job</Button>
      </div>
      <div className="my-2">
        <Button onClick={handleUpdateJob}>Update Job</Button>
      </div>
    </div>
  );
});

export default JobPage;
