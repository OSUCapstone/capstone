import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button, ListPlaceholder } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const CompanyRow = ({ company_name, jobs, contacts, onClick }) => (
  <div
    className="flex flex-row justify-between w-full h-32 py-4 px-6 border-b border-gray-400 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center items-start flex-grow">
      <p className="text-lg font-medium">{company_name}</p>
    </div>
    <div className="flex h-full flex-col justify-center items-end">
      <p>
        You have <strong>{jobs.length}</strong> job{jobs.length !== 1 && "s"}{" "}
        saved from this company
      </p>
      <p>
        You have <strong>{contacts.length}</strong> contact
        {contacts.length !== 1 && "s"} at this company
      </p>
    </div>
  </div>
);

const companySort = (a, b) => {
  let aLen = a.jobs.length + a.contacts.length;
  let bLen = b.jobs.length + b.contacts.length;
  if (aLen < bLen) {
    return 1;
  } else if (aLen > bLen) {
    return -1;
  } else {
    return 0;
  }
};

const CompaniesPage = withRouter(({ match, history, location }) => {
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

  return (
    <div className="w-full flex flex-col flex-grow overflow-hidden">
      {/* Top level information */}
      <div className="flex flex-row justify-between items-center w-full h-20 flex-none p-4 border-b border-gray-400">
        <Button
          colorClass="bg-green-500"
          onClick={() => history.push(`${Routes.COMPANY_CREATE_PAGE}`)}
        >
          Add Company
        </Button>
      </div>

      {/* Companies list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {companies === null && <ListPlaceholder>Loading...</ListPlaceholder>}
          {companies && companies.length === 0 && (
            <ListPlaceholder>List Empty...</ListPlaceholder>
          )}
          {companies &&
            companies.length > 0 &&
            companies
              .sort(companySort)
              .map((company) => (
                <CompanyRow
                  {...company}
                  onClick={() =>
                    history.push(
                      `${Routes.COMPANIES_BASE_ROUTE}/${company.company_id}`
                    )
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
});

export default CompaniesPage;
