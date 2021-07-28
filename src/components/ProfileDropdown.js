import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

import { useOutsideAlerter } from "../hooks";
import Routes from "../Routes";

const ProfileDropdown = ({}) => {
  let dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  let history = useHistory();

  useOutsideAlerter(dropdownRef, () => setDropdownOpen(false));

  const onClickLogout = () => {
    localStorage.removeItem("access_token");
    history.push(Routes.LOGIN_PAGE);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <CgProfile
        className="hover:text-gray-200 cursor-pointer mx-3 h-8 w-8 text-white"
        onClick={() => setDropdownOpen(true)}
      />
      {dropdownOpen && (
        <div className="absolute top-10 right-0 flex flex-col w-32 rounded shadow-md z-50 overflow-hidden">
          <div
            className="flex flex-row justify-start items-center w-full p-2 text-small font-medium bg-white hover:bg-gray-200 cursor-pointer"
            onClick={onClickLogout}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
