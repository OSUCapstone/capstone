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

const CompanyPage = withRouter(({ match, history, location }) => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      // Read company information
      setLoading(true);
      let res = await requestPost("/api/crudCompany", { crud: "read", company_id: id });
      if (res) {
        res.company.numberOfJobs = res.jobs.length && res.jobs[0].job_id == null ? 0 : res.jobs.length;
        res.company.numberOfContacts = res.contacts.length && res.contacts[0].contact_id == null ? 0 : res.contacts.length;
        setCompany(res.company);
        setJobs(res.jobs);
        setContacts(res.contacts);
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const onClickDeleteCompany = async () => {
    await requestPost("/api/crudCompany", { crud: "delete", company_id: id });
    history.push(Routes.COMPANIES_PAGE);
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
      <PageSection title="Company Details">
        <InfoSection title="Company" info={company.company_name} />
        <InfoSection title="No. of Jobs" info={company.numberOfJobs} />
        <InfoSection title="No. of Contacts" info={company.numberOfContacts} />
      </PageSection>

      <div className="flex flex-row self-end">
        <Button
          colorClass="h-8 bg-red-500"
          onClick={() => setModalVisible(true)}
        >
          Delete Company
        </Button>
      </div>

      {/* Jobs Section */}
      <PageSection title="Jobs at this company">
        {jobs.length && jobs[0].job_id != null ? (
          jobs.map((job) => (
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

      {/* Contacts Section */}
      <PageSection title="Contacts at this company">
        {contacts.length && contacts[0].contact_id != null ? (
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

      {/* Confirm Deletion */}
      {modalVisible && (
        <Modal setOpen={setModalVisible}>
          <p className="text-black font-medium text-center mb-5">
            Are you sure you want to delete this company?
          </p>
          <div className="flex flex-row">
            <Button colorClass="bg-red-500 mr-2" onClick={onClickDeleteCompany}>
              Delete
            </Button>
            <Button onClick={() => setModalVisible(false)}>Nevermind</Button>
          </div>
        </Modal>
      )}
    </div>
  );
});

export default CompanyPage;
