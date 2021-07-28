import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../components";

import Routes from "../Routes";

const jobs = [
  {
    job_id: "1234",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
  {
    job_id: "12345",
    company_id: "1234",
    company_name: "Company name??",
    user_id: "1234",
    job_title: "Test Job",
    availability: "Available",
    application_status: "Applied",
    type: "Full Time",
  },
];

const JobRow = ({
  job_title,
  company_name,
  availability,
  application_status,
  type,
  onClick,
}) => (
  <div
    className="flex flex-row justify-between w-full h-32 py-4 px-6 border-b border-gray-400 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center items-start flex-grow">
      <p className="text-lg font-medium">{job_title}</p>
      <p className="text-sm font-regular my-1">{company_name}</p>
      <p className="text-sm font-regular my-1">{type}</p>
    </div>
    <div className="flex h-full flex-col justify-center items-center">
      <p>{availability}</p>
      <p>{application_status}</p>
    </div>
  </div>
);

const JobsPage = withRouter(({ match, history, location }) => {
  return (
    <div className="w-full flex flex-col flex-grow overflow-hidden">
      {/* Top level information */}
      <div className="flex flex-row justify-between items-center w-full h-20 p-4 border-b border-gray-400">
        <Button colorClass="bg-green-500">Add Job</Button>
      </div>

      {/* Jobs list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {jobs.map((job) => (
            <JobRow
              {...job}
              onClick={() =>
                history.push(`${Routes.JOBS_BASE_ROUTE}/${job.job_id}`)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default JobsPage;
