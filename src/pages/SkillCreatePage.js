import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const SkillCreatePage = withRouter(({ match, history, location }) => {
  const [skill, setSkill] = useState("");
  const [proficiency, setProficiency] = useState("");

  const handleCreateSkill = async () => {
    try {
      let success =  await requestPost(
        '/api/crudSkill',
        {
          crud: 'create',
          skill_name: `${skill}`,
          proficiency: `${proficiency}`,
        }
      );

      if (success) {
        history.push(Routes.SKILLS_PAGE);
      } else {
        console.log('Failed to create skill!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Skills</Heading>
      <div className="my-2">
        <TextInput
          value={skill}
          setValue={setSkill}
          placeholder="Enter skill name..."
        />
        <TextInput
          value={proficiency}
          setValue={setProficiency}
          placeholder="Enter proficiency..."
        />
      </div>
      <div className="my-2">
        <Button onClick={handleCreateSkill}>Add Skill</Button>
      </div>
    </div>
  );
});

export default SkillCreatePage;
