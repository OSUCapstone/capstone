import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const SkillRow = ({
  skill_name,
  onClick,
}) => (
  <div
    className="flex flex-row justify-between w-full h-32 py-4 px-6 border-b border-gray-400 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center items-start flex-grow">
      <p className="text-lg font-medium">{skill_name}</p>
    </div>
  </div>
);

const ListPlaceholder = ({ children }) => (
  <div className="w-full flex-grow flex justify-center items-center text-gray-500 italic text-lg">
    {children}
  </div>
);

const SkillsPage = withRouter(({ match, history, location }) => {
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    const init = async () => {
      let res = await requestPost("/api/crudSkill", { crud: "readAll" });
      if (res) {
        setSkills(res);
      } else {
        setSkills([]);
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
            history.push(`${Routes.SKILL_CREATE_PAGE}`)
          }
        >Add Skill</Button>
      </div>

      {/* Skills list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {skills == null && <ListPlaceholder>Loading...</ListPlaceholder>}
          {skills && skills.length === 0 && (
            <ListPlaceholder>List Empty...</ListPlaceholder>
          )}
          {skills &&
            skills.length > 0 &&
            skills.map((skill) => (
              <SkillRow
                {...skill}
                onClick={() =>
                  history.push(`${Routes.SKILLS_BASE_ROUTE}/${skill.skill_id}`)
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
});

export default SkillsPage;
