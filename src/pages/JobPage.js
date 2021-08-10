import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";

import {
  Button,
  Footnote,
  GeneralDropdown,
  Heading,
  InfoSection,
  ListItem,
  Modal,
  PageSection,
  TextInput,
} from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const JobPage = withRouter(({ match, history, location }) => {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [skills, setSkills] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [otherJobsAtCompany, setOtherJobsAtCompany] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [editStatusValue, setEditStatusValue] = useState("");
  const [addSkillModalVisible, setAddSkillModalVisible] = useState(false);
  const [possibleSkills, setPossibleSkills] = useState([]);
  const [selectedNewSkill, setSelectedNewSkill] = useState(null);
  const [trigger, setTrigger] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      // Read job information
      setLoading(true);
      let res = await requestPost("/api/crudJob", { crud: "read", job_id: id });
      if (res) {
        setJob(res.job);
        setSkills(res.skills);
        setContacts(res.contacts);
        setStatus(res.job.application_status);
        setOtherJobsAtCompany(res.otherJobs.filter((job) => job.job_id !== id));
        setLoading(false);
      }
      let skillsRes = await requestPost("/api/crudSkill", { crud: "readAll" });
      if (skillsRes) {
        let alreadyExistingSkillIds = res.skills.map((skill) => skill.skill_id);
        setPossibleSkills(
          skillsRes.filter(
            (skill) => !alreadyExistingSkillIds.includes(skill.skill_id)
          )
        );
      }
    };
    init();
  }, [id, trigger]);

  useEffect(() => {
    setEditStatusValue(job?.application_status);
  }, [job]);

  const onClickDeleteJob = async () => {
    await requestPost("/api/crudJob", { crud: "delete", job_id: id });
    history.push(Routes.JOBS_PAGE);
  };

  const onClickSaveStatus = async () => {
    await requestPost("/api/crudJob", {
      crud: "update",
      company_id: job.company_id,
      job_title: job.job_title,
      availability: job.availability,
      application_status: editStatusValue,
      type: job.type,
      job_id: id,
    });
    setStatus(editStatusValue);
    setEditModalVisible(false);
  };

  const onClickSaveNewSkill = async () => {
    await requestPost("/api/crudJobSkill", {
      crud: "create",
      skill_id: selectedNewSkill.skill_id,
      job_id: id,
    });
    setTrigger((trig) => !trig);
    setAddSkillModalVisible(false);
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
      <PageSection title="Job Details">
        <InfoSection title="Company" info={job.company_name} />
        <InfoSection title="Job Title" info={job.job_title} />
        <InfoSection title="Job Type" info={job.type} textClass="xl" />
        <InfoSection
          title="Availability"
          info={job.availability}
          textClass="xl"
        />
        <InfoSection title="Your Progress" info={status} textClass="xl" />
      </PageSection>

      <div className="flex flex-row self-end">
        <Button
          colorClass="h-8 bg-blue-400 mr-2"
          onClick={() => setEditModalVisible(true)}
        >
          Edit Application Status
        </Button>
        <Button
          colorClass="h-8 bg-red-500"
          onClick={() => setModalVisible(true)}
        >
          Delete Job
        </Button>
      </div>

      {/* Skills Section */}
      <PageSection title="Skills">
        {skills.length ? (
          skills.map((skill) => (
            <ListItem
              title={skill.skill_name}
              onClick={() =>
                history.push(`${Routes.SKILLS_BASE_ROUTE}/${skill.skill_id}`)
              }
            />
          ))
        ) : (
          <p>You haven't added any skills to this job</p>
        )}
      </PageSection>
      <div className="flex flex-row self-end">
        <Button
          colorClass="h-8 bg-blue-400 mr-2"
          onClick={() => setAddSkillModalVisible(true)}
        >
          Add Skill
        </Button>
      </div>

      {/* Contacts Section */}
      <PageSection title="Contacts at this company">
        {contacts.length ? (
          contacts.map((contact) => (
            <ListItem
              title={contact.contact_name}
              onClick={() =>
                history.push(
                  `${Routes.CONTACTS_BASE_ROUTE}/${contact.contact_id}`
                )
              }
            />
          ))
        ) : (
          <p>You don't have any contacts at this company</p>
        )}
      </PageSection>

      {/* Other Jobs Section */}
      <PageSection title="Other jobs at this company">
        {otherJobsAtCompany.length ? (
          otherJobsAtCompany.map((job) => (
            <ListItem
              title={job.job_title}
              onClick={() =>
                history.push(`${Routes.JOBS_BASE_ROUTE}/${job.job_id}`)
              }
            />
          ))
        ) : (
          <p>You don't have any jobs listed at this company</p>
        )}
      </PageSection>

      {/* Confirm Deletion */}
      {modalVisible && (
        <Modal setOpen={setModalVisible}>
          <p className="text-black font-medium text-center mb-5">
            Are you sure you want to delete this job?
          </p>
          <div className="flex flex-row">
            <Button colorClass="bg-red-500 mr-2" onClick={onClickDeleteJob}>
              Delete
            </Button>
            <Button onClick={() => setModalVisible(false)}>Nevermind</Button>
          </div>
        </Modal>
      )}

      {/* Edit Proficiency*/}
      {editModalVisible && (
        <Modal setOpen={setEditModalVisible}>
          <p className="text-black font-medium text-center my-5">
            Edit your application status
          </p>
          <TextInput
            value={editStatusValue}
            setValue={setEditStatusValue}
            placeholder="New Application Status"
          />
          <Button onClick={onClickSaveStatus} colorClass="bg-green-400 my-5">
            Save
          </Button>
        </Modal>
      )}

      {/* Add Skill*/}
      {addSkillModalVisible && (
        <Modal setOpen={setAddSkillModalVisible}>
          <p className="text-black font-medium text-center my-5">
            Add a skill to this job
          </p>
          <GeneralDropdown
            options={possibleSkills}
            selected={selectedNewSkill}
            onSelect={setSelectedNewSkill}
            placeholder="Add a skill!"
            displayAttribute="skill_name"
          />
          <Button onClick={onClickSaveNewSkill} colorClass="bg-green-400 my-5">
            Save
          </Button>
          <Footnote
            unlinkedText="If you want to add a new skill"
            linkedText="click here"
            onClickLink={() => history.push(Routes.SKILL_CREATE_PAGE)}
          />
        </Modal>
      )}
    </div>
  );
});

export default JobPage;
