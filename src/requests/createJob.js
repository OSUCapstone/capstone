import axios from "axios";

const createJob = async (jobId, companyId, jobTitle, userID, availability, applicationStatus, type) => {
  try {
    return await axios.post(
      "/api/crudJob",
      {
        crud: 'create',
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

export default createJob;
