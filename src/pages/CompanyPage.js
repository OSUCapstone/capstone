import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { createCompany, requestPost } from "../requests";
import Routes from "../Routes";

const CompanyPage = withRouter(({ match, history, location }) => {
  const [company, setCompany] = useState("");

  const handleCreateCompany = async () => {
    try {
      let response = await requestPost("/api/getUserId");
      let userId = response.data;
      await createCompany(company, userId);
      history.push(Routes.COMPANY_PAGE);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* <div className="absolute top-5 left-5">
        <Heading>Job Tracker</Heading>
      </div> */}
      <Heading>Companies</Heading>
      <div className="my-2">
        <TextInput
          value={company}
          setValue={setCompany}
          placeholder="Enter company name..."
        />
      </div>
      <div className="my-2">
        <Button onClick={handleCreateCompany}>Add Company</Button>
      </div>
    </div>
  );
});

export default CompanyPage;
