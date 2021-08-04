import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, Button } from "../components";
import { requestPost } from "../requests";

const SkillPage = withRouter(({ match, history, location }) => {
  const [skill, setSkill] = useState("");
  
  useEffect(() => {
    const init = async () => {      
      // Extract skill_id from route
      let id = location.pathname;
      id = id.substr(id.lastIndexOf('/') + 1);
      
      // Read skill information
      let res = await requestPost("/api/crudSkill", { crud: "read", skill_id: id });
      if (res) {
        console.log(res);
        setSkill(res);
      } else {
        setSkill([]);
      }
    };
    init ();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {skill == null && <Heading>Loading...</Heading>}
      {skill && <Heading>{skill.skill_name}</Heading>}
    </div>
  );
});

export default SkillPage;
