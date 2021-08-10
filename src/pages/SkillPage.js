import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";

import {
  Button,
  GeneralDropdown,
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
  const [proficiency, setProficiency] = useState(null);
  const [editedProficiency, setEditedProficiency] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      // Read skill information
      setLoading(true);
      let res = await requestPost("/api/crudSkill", {
        crud: "read",
        skill_id: id,
      });
      if (res) {
        setSkill(res.skill);
        setJobs(res.jobs);
        setProficiency(res.skill.proficiency);
        setEditedProficiency(res.skill.proficiency);
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const onClickDeleteSkill = async () => {
    await requestPost("/api/crudSkill", { crud: "delete", skill_id: id });
    history.push(Routes.SKILLS_PAGE);
  };

  const onClickSaveProficiency = async () => {
    await requestPost("/api/crudSkill", {
      crud: "update",
      skill_id: id,
      skill_name: skill.skill_name,
      proficiency: editedProficiency,
    });
    setProficiency(editedProficiency);
    setEditModalVisible(false);
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
        <InfoSection title="Profiency" info={proficiencies[proficiency]} />
      </PageSection>

      <div className="flex flex-row self-end">
        <Button
          colorClass="h-8 bg-blue-400 mr-2"
          onClick={() => setEditModalVisible(true)}
        >
          Edit Skill Proficiency
        </Button>
        <Button
          colorClass="h-8 bg-red-500"
          onClick={() => setDeleteModalVisible(true)}
        >
          Delete Skill
        </Button>
      </div>

      {/* Jobs Section */}
      <PageSection title="Jobs requiring this skill">
        {jobs.length ? (
          jobs.map((job) => (
            <ListItem
              title={job.job_title + " - " + job.company_name}
              onClick={() =>
                history.push(`${Routes.JOBS_BASE_ROUTE}/${job.job_id}`)
              }
            />
          ))
        ) : (
          <p>You don't have any jobs requiring this skill</p>
        )}
      </PageSection>

      {/* Confirm Deletion */}
      {deleteModalVisible && (
        <Modal setOpen={setDeleteModalVisible}>
          <p className="text-black font-medium text-center mb-5">
            Are you sure you want to delete this skill?
          </p>
          <div className="flex flex-row">
            <Button colorClass="bg-red-500 mr-2" onClick={onClickDeleteSkill}>
              Delete
            </Button>
            <Button onClick={() => setDeleteModalVisible(false)}>
              Nevermind
            </Button>
          </div>
        </Modal>
      )}

      {/* Edit Proficiency*/}
      {editModalVisible && (
        <Modal setOpen={setEditModalVisible}>
          <p className="text-black font-medium text-center my-5">
            Select a proficiency for this skill
          </p>

          <GeneralDropdown
            options={proficiencies}
            selected={proficiencies[editedProficiency]}
            onSelect={(prof) =>
              setEditedProficiency(proficiencies.findIndex((p) => p === prof))
            }
            placeholder="Proficiency"
          />
          <Button
            onClick={onClickSaveProficiency}
            colorClass="bg-green-400 my-5"
          >
            Save
          </Button>
        </Modal>
      )}
    </div>
  );
});

export default SkillPage;
