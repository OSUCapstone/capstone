import axios from "axios";

const deleteJob = async (jobId) => {
  try {
    return await axios.post(
      "/api/crudJob",
      {
        crud: 'delete',
        jobId,
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

export default deleteJob;