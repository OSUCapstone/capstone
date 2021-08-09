import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button, ListPlaceholder } from "../components";
import { requestPost } from "../requests";
import { proficiencies } from "../constants";
import Routes from "../Routes";

const ProficiencyBar = ({ filledIn }) => (
  <div className="flex flex-row h-4 overflow-hidden">
    {Array(5)
      .fill(null)
      .map((_, index) => (
        <div
          className={`h-full w-4 mr-1 rounded ${
            filledIn <= index ? "border border-gray-300" : "bg-green-500"
          }`}
        />
      ))}
  </div>
);

const SkillRow = ({ skill_name, proficiency, jobs, onClick }) => (
  <div
    className="flex flex-row justify-between w-full h-32 py-4 px-6 border-b border-gray-400 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center items-start flex-grow">
      <p className="text-lg font-medium">{skill_name}</p>
      <p className="text-base font-regular mb-2">
        {proficiencies[proficiency]}
      </p>
      <ProficiencyBar filledIn={proficiency + 1} />
    </div>
    <div className="flex h-full flex-col justify-center items-end">
      <p>
        You have <strong>{jobs.length}</strong> job{jobs.length !== 1 && "s"}{" "}
        saved that value this skill
      </p>
    </div>
  </div>
);

const skillSort = (a, b) => {
  let aLen = a.proficiency + a.jobs.length;
  let bLen = b.proficiency + b.jobs.length;
  if (aLen < bLen) {
    return 1;
  } else if (aLen > bLen) {
    return -1;
  } else {
    return 0;
  }
};

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
    init();
  }, []);

  return (
    <div className="w-full flex flex-col flex-grow overflow-hidden">
      {/* Top level information */}
      <div className="flex flex-row justify-between items-center w-full h-20 p-4 border-b border-gray-400">
        <Button
          colorClass="bg-green-500"
          onClick={() => history.push(`${Routes.SKILL_CREATE_PAGE}`)}
        >
          Add Skill
        </Button>
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
            skills
              .sort(skillSort)
              .map((skill) => (
                <SkillRow
                  {...skill}
                  onClick={() =>
                    history.push(
                      `${Routes.SKILLS_BASE_ROUTE}/${skill.skill_id}`
                    )
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
});

export default SkillsPage;
