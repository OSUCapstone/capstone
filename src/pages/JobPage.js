import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, Button } from "../components";
import { requestPost } from "../requests";

const JobPage = withRouter(({ match, history, location }) => {
  const [job, setJob] = useState("");
  
  useEffect(() => {
    const init = async () => {      
      // Extract job_id from route
      let id = location.pathname;
      id = id.substr(id.lastIndexOf('/') + 1);
      
      // Read job information
      let res = await requestPost("/api/crudJob", { crud: "read", job_id: id });
      if (res) {
        console.log(res);
        setJob(res);
      } else {
        setJob([]);
      }
    };
    init ();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {job == null && <Heading>Loading...</Heading>}
      {job && <Heading>{job.job_title}</Heading>}
    </div>
  );
});

export default JobPage;
