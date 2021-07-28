import React from "react";
import { withRouter } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

import Routes from "../Routes";

const links = [
  {
    title: "Jobs",
    route: Routes.JOBS_PAGE,
  },
  {
    title: "Skills",
    route: Routes.SKILLS_PAGE,
  },
  {
    title: "Companies",
    route: Routes.COMPANIES_PAGE,
  },
  {
    title: "Contacts",
    route: Routes.CONTACTS_PAGE,
  },
];

const NavItem = ({ link, onClick, active }) => (
  <div className="relative flex flex-col justify-center items-center h-full">
    {active && <div className="absolute top-0 h-1 w-full bg-white" />}
    <p
      className="text-lg text-white font-semibold mx-3 hover:text-gray-200 cursor-pointer"
      onClick={onClick}
    >
      {link.title}
    </p>
  </div>
);

const NavBar = withRouter(({ location, history }) => {
  return (
    <div
      className="flex flex-row justify-between items-center w-full bg-blue-400 px-4"
      style={{ height: "72px" }}
    >
      <div className="flex flex-row justify-start items-center h-full flex-grow">
        {links.map((link) => (
          <NavItem
            link={link}
            onClick={() => history.push(link.route)}
            active={location.pathname === link.route}
          />
        ))}
      </div>
      <CgProfile className="hover:text-gray-200 cursor-pointer mx-3 h-8 w-8 text-white" />
    </div>
  );
});

export default NavBar;
