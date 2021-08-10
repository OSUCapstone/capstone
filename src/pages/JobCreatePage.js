import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button, GeneralDropdown } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const JobCreatePage = withRouter(({ match, history, location }) => {
  const [job, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [availability, setAvailability] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [companies, setCompanies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      let res = await requestPost("/api/crudCompany", { crud: "readAll" });
      if (res) {
        setCompanies(res);
      }
    };
    init();
  }, []);

  const handleCreateJob = async () => {
    setErrorMessage("");
    if (!(job && company && availability && status && type)) {
      setErrorMessage(
        "You must fill out all fields before submitting the form"
      );
      return;
    }
    try {
      let success = await requestPost("/api/crudJob", {
        crud: "create",
        job_title: `${job}`,
        company_id: `${company.company_id}`,
        availability: `${availability}`,
        application_status: `${status}`,
        type: `${type}`,
      });

      if (success) {
        history.push(Routes.JOBS_PAGE);
      } else {
        console.log("Failed to create job!");
        setErrorMessage(
          "An error occurred during job creation. Please make sure all fields are filled out correctly before submitting."
        );
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "An error occurred during job creation. Please make sure all fields are filled out correctly before submitting."
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Create Job</Heading>
      <div
        className="flex flex-col justify-between my-2"
        style={{ height: "250px" }}
      >
        <TextInput value={job} setValue={setJob} placeholder="Job title" />
        <GeneralDropdown
          options={companies}
          selected={company}
          onSelect={setCompany}
          displayAttribute="company_name"
          placeholder="Company"
        />
        <TextInput
          value={availability}
          setValue={setAvailability}
          placeholder="Availability (ex: 'Until March')"
        />
        <TextInput
          value={status}
          setValue={setStatus}
          placeholder="Application status (ex: 'Scheduled Interview')"
        />
        <GeneralDropdown
          options={["Full Time", "Part Time", "Contract", "Internship"]}
          selected={type}
          onSelect={setType}
          placeholder="Job type"
        />
      </div>
      <div className="my-2">
        <Button onClick={handleCreateJob}>Add Job</Button>
      </div>
      {errorMessage && (
        <p className="text-xs text-red-500 mt-2 w-80 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default JobCreatePage;
