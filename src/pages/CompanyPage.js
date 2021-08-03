import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { createCompany, requestPost } from "../requests";
import Routes from "../Routes";

const CompanyPage = withRouter(({ match, history, location }) => {
  const [company, setCompany] = useState("");

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Companies</Heading>
      <div className="my-2">
        <p>Company Title Here</p>
      </div>
    </div>
  );
});

export default CompanyPage;
