import React from "react";
import { withRouter } from "react-router-dom";

import { Heading } from "../components";

const JobPage = withRouter(({ match, history, location }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Job Page</Heading>
    </div>
  );
});

export default JobPage;
