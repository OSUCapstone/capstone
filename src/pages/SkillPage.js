import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";

import {
  Button,
  Heading,
  InfoSection,
  ListItem,
  Modal,
  PageSection,
} from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";
import { proficiencies } from "../constants";

const SkillPage = withRouter(({ match, history, location }) => {
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      // Read skill information
      setLoading(true);
      let res = await requestPost("/api/crudSkill", { crud: "read", skill_id: id });
      if (res) {
        setSkill(res.skill);
        setJobs(res.jobs);
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const onClickDeleteSkill = async () => {
    await requestPost("/api/crudSkill", { crud: "delete", skill_id: id });
    history.push(Routes.SKILLS_PAGE);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-5">
        <Heading>Loading...</Heading>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col px-10 py-5 overflow-scroll">
      {/* Details Section */}
      <PageSection title="Skill Details">        
        <InfoSection title="Skill" info={skill.skill_name} />
        <InfoSection title="Profiency" info={proficiencies[skill.proficiency]} />
      </PageSection>

      <div className="flex flex-row self-end">
        <Button
          colorClass="h-8 bg-red-500"
          onClick={() => setModalVisible(true)}
        >
          Delete Skill
        </Button>
      </div>

      {/* Jobs Section */}
      <PageSection title="Jobs requiring this skill">
        {jobs.length ? (
          jobs.map((job) => (
            <ListItem
              title={job.job_title + ' - '+ job.company_name}
              onClick={() =>
                history.push(`${Routes.JOBS_BASE_ROUTE}/${job.job_id}`
                )
              }
            />
          ))
        ) : (
          <p>You don't have any jobs requiring this skill</p>
        )}
      </PageSection>

      {/* Confirm Deletion */}
      {modalVisible && (
        <Modal setOpen={setModalVisible}>
          <p className="text-black font-medium text-center mb-5">
            Are you sure you want to delete this skill?
          </p>
          <div className="flex flex-row">
            <Button colorClass="bg-red-500 mr-2" onClick={onClickDeleteSkill}>
              Delete
            </Button>
            <Button onClick={() => setModalVisible(false)}>Nevermind</Button>
          </div>
        </Modal>
      )}
    </div>
  );
});

export default SkillPage;
