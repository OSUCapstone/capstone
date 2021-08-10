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
      }
    } catch (err) {
      console.log(err);
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
    </div>
  );
});

export default JobCreatePage;
