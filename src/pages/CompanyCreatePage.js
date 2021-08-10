import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const CompanyCreatePage = withRouter(({ match, history, location }) => {
  const [company, setCompany] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateCompany = async () => {
    setErrorMessage("");
    if (!company) {
      setErrorMessage(
        "You must fill out all fields before submitting the form"
      );
      return;
    }
    try {
      let success = await requestPost("/api/crudCompany", {
        crud: "create",
        company_name: `${company}`,
      });

      if (success) {
        history.push(Routes.COMPANIES_PAGE);
      } else {
        console.log("Failed to create company!");
        setErrorMessage(
          "An error occurred during company creation. Please make sure all fields are filled out correctly before submitting."
        );
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "An error occurred during company creation. Please make sure all fields are filled out correctly before submitting."
      );
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
      {errorMessage && (
        <p className="text-xs text-red-500 mt-2 w-80 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default CompanyCreatePage;
