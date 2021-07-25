import axios from "axios";

const createCompany = async (company, userId) => {
  try {
    return await axios.post(
      "/api/createCompany",
      {
        company,
        userId,
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

export default createCompany;
