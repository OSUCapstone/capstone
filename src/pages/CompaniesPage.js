import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../components";
import { requestPost } from "../requests";

import Routes from "../Routes";

const getAllCompanies = async () => {
  try {
    let response =  await requestPost(
      '/api/crudCompany',
      {
        crud: 'read_all',
      }
    );

    if (response !== false) {
      return response;
    } else {
      console.log('Failed to get all companies!');
    }
  } catch (err) {
    console.log(err);
  }
};

// const companies = [
//   {
//     company_id: "1234",
//     company_name: "First Co.",
//     user_id: "1234",
//   },
//   {
//     company_id: "12345",
//     company_name: "Second Inc.",
//     user_id: "1234",
//   },
// ];

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

const CompaniesPage = withRouter(({ match, history, location }) => {
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
        <Button
          onClick={() => 
            getAllCompanies().then((values) => {
              console.log(values);
            })
          }
        >Get All Companies</Button>
      </div>

      {/* Companies list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {/* {companies.map((company) => (
            <CompanyRow
              {...company}
              onClick={() =>
                history.push(`${Routes.COMPANY_PAGE}`.replace(':id', `${company.company_id}`))
              }
            />
          ))} */}
        </div>
      </div>
    </div>
  );
});

export default CompaniesPage;
