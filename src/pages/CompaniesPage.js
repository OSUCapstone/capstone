import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const CompanyRow = ({
  company_name,
  onClick,
}) => (
  <div
    className="flex flex-row justify-between w-full h-32 py-4 px-6 border-b border-gray-400 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center items-start flex-grow">
      <p className="text-lg font-medium">{company_name}</p>
    </div>
    <div className="flex h-full flex-col justify-center items-center">
      <p>Insert # of jobs at company here</p>
    </div>
  </div>
);

const ListPlaceholder = ({ children }) => (
  <div className="w-full flex-grow flex justify-center items-center text-gray-500 italic text-lg">
    {children}
  </div>
);

const CompaniesPage = withRouter(({ match, history, location }) => {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    const init = async () => {
      let res = await requestPost("/api/crudCompany", { crud: "readAll" });
      if (res) {
        setCompanies(res);
      } else {
        setCompanies([]);
      }
    };
    init ();
  }, []);

  return (
    <div className="w-full flex flex-col flex-grow overflow-hidden">
      {/* Top level information */}
      <div className="flex flex-row justify-between items-center w-full h-20 p-4 border-b border-gray-400">
        <Button 
          colorClass="bg-green-500"
          onClick={() => 
            history.push(`${Routes.COMPANY_CREATE_PAGE}`)
          }
        >Add Company</Button>
      </div>

      {/* Companies list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {companies == null && <ListPlaceholder>Loading...</ListPlaceholder>}
          {companies && companies.length === 0 && (
            <ListPlaceholder>List Empty...</ListPlaceholder>
          )}
          {companies &&
            companies.length > 0 &&
            companies.map((company) => (
              <CompanyRow
                {...company}
                onClick={() =>
                  history.push(`${Routes.COMPANIES_BASE_ROUTE}/${company.company_id}`)
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
});

export default CompaniesPage;
