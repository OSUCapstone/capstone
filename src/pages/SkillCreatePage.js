import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button, GeneralDropdown } from "../components";
import { requestPost } from "../requests";
import { proficiencies } from "../constants";
import Routes from "../Routes";

const SkillCreatePage = withRouter(({ match, history, location }) => {
  const [skill, setSkill] = useState("");
  const [proficiency, setProficiency] = useState("");

  const handleCreateSkill = async () => {
    try {
      let success = await requestPost("/api/crudSkill", {
        crud: "create",
        skill_name: `${skill}`,
        proficiency: `${proficiency}`,
      });

      if (success) {
        history.push(Routes.SKILLS_PAGE);
      } else {
        console.log("Failed to create skill!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Create Skill</Heading>
      <div
        className="flex flex-col justify-between my-2"
        style={{ height: "90px" }}
      >
        <TextInput
          value={skill}
          setValue={setSkill}
          placeholder="Skill name (ex: 'JavaScript')"
        />
        <GeneralDropdown
          options={proficiencies}
          selected={proficiencies[proficiency]}
          onSelect={(prof) =>
            setProficiency(proficiencies.findIndex((p) => p === prof))
          }
          placeholder="Proficiency"
        />
      </div>
      <div className="my-2">
        <Button onClick={handleCreateSkill}>Add Skill</Button>
      </div>
    </div>
  );
});

export default SkillCreatePage;
