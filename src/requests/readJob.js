import axios from "axios";

const readJob = async (jobId, companyId, jobTitle, userID, availability, applicationStatus, type) => {
  try {
    return await axios.post(
      "/api/crudJob",
      {
        crud: 'read',
        jobId,
        companyId,
        jobTitle,
        userID,
        availability,
        applicationStatus,
        type,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export default readJob;
