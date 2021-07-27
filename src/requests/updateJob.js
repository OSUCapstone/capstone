import axios from "axios";

const updateJob = async (jobId, companyId, jobTitle, availability, applicationStatus, type) => {
  try {
    return await axios.post(
      "/api/crudJob",
      {
        crud: 'update',
        jobId,
        companyId, 
        jobTitle,
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

export default updateJob;
