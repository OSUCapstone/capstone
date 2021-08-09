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

const ContactPage = withRouter(({ match, history, location }) => {
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      // Read contact information
      setLoading(true);
      let res = await requestPost("/api/crudContact", { crud: "read", contact_id: id });
      if (res) {
        setContact(res.contact);
        setJobs(res.jobs);
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const onClickDeleteContact = async () => {
    await requestPost("/api/crudContact", { crud: "delete", contact_id: id });
    history.push(Routes.CONTACTS_PAGE);
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
      <PageSection title="Contact Details">
        <InfoSection title="Name" info={contact.contact_name} />
        <InfoSection title="Company" info={contact.company_name} textClass="xl" />
        <InfoSection title="Role" info={contact.role} textClass="xl" />
        <InfoSection title="Email" info={contact.email} textClass="xl" />
        <InfoSection title="Phone Number" info={contact.phone_number} textClass="xl" />
      </PageSection>

      <div className="flex flex-row self-end">
        <Button
          colorClass="h-8 bg-red-500"
          onClick={() => setModalVisible(true)}
        >
          Delete Contact
        </Button>
      </div>

      {/* Jobs Section */}
      <PageSection title="This contact can help you with the following jobs">
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

      {/* Confirm Deletion */}
      {modalVisible && (
        <Modal setOpen={setModalVisible}>
          <p className="text-black font-medium text-center mb-5">
            Are you sure you want to delete this contact?
          </p>
          <div className="flex flex-row">
            <Button colorClass="bg-red-500 mr-2" onClick={onClickDeleteContact}>
              Delete
            </Button>
            <Button onClick={() => setModalVisible(false)}>Nevermind</Button>
          </div>
        </Modal>
      )}
    </div>
  );
});

export default ContactPage;
