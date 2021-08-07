import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const JobCreatePage = withRouter(({ match, history, location }) => {
  const [job, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [availability, setAvailability] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const handleCreateJob = async () => {
    try {
      let success =  await requestPost(
        '/api/crudJob',
        {
          crud: 'create',
          job_title: `${job}`,
          company_id: `${company}`,
          availability: `${availability}`,
          application_status: `${status}`,
          type: `${type}`,
        }
      );

      if (success) {
        history.push(Routes.JOBS_PAGE);
      } else {
        console.log('Failed to create job!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Jobs</Heading>
      <div className="my-2">
        <TextInput
          value={job}
          setValue={setJob}
          placeholder="Enter job title..."
        />
        <TextInput 
          value={company}
          setValue={setCompany}
          placeholder="Enter company..."
        />
        <TextInput 
          value={availability}
          setValue={setAvailability}
          placeholder="Enter availability..."
        />
        <TextInput 
          value={status}
          setValue={setStatus}
          placeholder="Enter status..."
        />
        <TextInput 
          value={type}
          setValue={setType}
          placeholder="Enter type..."
        />
      </div>
      <div className="my-2">
        <Button onClick={handleCreateJob}>Add Job</Button>
      </div>
    </div>
  );
});

export default JobCreatePage;
