import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const CompanyCreatePage = withRouter(({ match, history, location }) => {
  const [company, setCompany] = useState("");

  const handleCreateCompany = async () => {
    try {
      let success =  await requestPost(
        '/api/crudCompany',
        {
          crud: 'create',
          company_name: `${company}`,
        }
      );

      if (success) {
        history.push(Routes.COMPANIES_PAGE);
      } else {
        console.log('Failed to create company!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
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

export default CompanyCreatePage;
