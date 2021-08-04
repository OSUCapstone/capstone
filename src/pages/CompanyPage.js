import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, Button } from "../components";
import { requestPost } from "../requests";

const CompanyPage = withRouter(({ match, history, location }) => {
  const [company, setCompany] = useState("");
  
  useEffect(() => {
    const init = async () => {      
      // Extract company_id from route
      let id = location.pathname;
      id = id.substr(id.lastIndexOf('/') + 1);
      
      // Read company information
      let res = await requestPost("/api/crudCompany", { crud: "read", company_id: id });
      if (res) {
        console.log(res);
        setCompany(res);
      } else {
        setCompany([]);
      }
    };
    init ();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {company == null && <Heading>Loading...</Heading>}
      {company && <Heading>{company.company_name}</Heading>}
    </div>
  );
});

export default CompanyPage;
