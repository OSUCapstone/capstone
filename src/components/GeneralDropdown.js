import { useRef, useState } from "react";

import { useOutsideAlerter } from "../hooks";

const GeneralDropdown = ({
  selected,
  options,
  onSelect,
  displayAttribute = null,
  placeholder,
}) => {
  let dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useOutsideAlerter(dropdownRef, () => setDropdownOpen(false));

  return (
    <div className="relative w-full flex flex-col" ref={dropdownRef}>
      <div
        className="border shadow rounded h-10 flex flex-row justify-start items-center w-96 cursor-pointer pl-2"
        onClick={() => setDropdownOpen(true)}
      >
        <p className={selected ? "text-black" : "text-gray-400"}>
          {selected
            ? displayAttribute
              ? selected[displayAttribute]
              : selected
            : placeholder}
        </p>
      </div>
      {dropdownOpen && (
        <div
          className="absolute flex flex-col border shadow rounded top-12 bg-white w-full overflow-scroll z-50"
          style={{ maxHeight: "128px" }}
        >
          {options &&
            options.map((option) => (
              <div
                className="flex flex-row justify-start items-center pl-2 w-full h-8 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  onSelect(option);
                  setDropdownOpen(false);
                }}
              >
                <p>{displayAttribute ? option[displayAttribute] : option}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default GeneralDropdown;
