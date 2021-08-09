import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button, ListPlaceholder } from "../components";
import requestPost from "../requests/requestPost";
import Routes from "../Routes";

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
    <div className="flex h-full flex-col justify-center items-end">
      <p>{availability}</p>
      <p>{application_status}</p>
    </div>
  </div>
);

const JobsPage = withRouter(({ match, history, location }) => {
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    const init = async () => {
      let res = await requestPost("/api/crudJob", { crud: "readAll" });
      if (res) {
        setJobs(res);
      } else {
        setJobs([]);
      }
    };
    init();
  }, []);

  return (
    <div className="w-full flex flex-col flex-grow overflow-hidden">
      {/* Top level information */}
      <div className="flex flex-row justify-between items-center w-full h-20 p-4 border-b border-gray-400">
        <Button
          colorClass="bg-green-500"
          onClick={() => history.push(`${Routes.JOB_CREATE_PAGE}`)}
        >
          Add Job
        </Button>
      </div>

      {/* Jobs list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {jobs === null && <ListPlaceholder>Loading...</ListPlaceholder>}
          {jobs && jobs.length === 0 && (
            <ListPlaceholder>List Empty...</ListPlaceholder>
          )}
          {jobs &&
            jobs.length > 0 &&
            jobs.map((job) => (
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
