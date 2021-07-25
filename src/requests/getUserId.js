import axios from "axios";

const getUserId = async (token) => {
  try {
    return await axios.post(
      "/api/getUserId",
      {
        token,
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

export default getUserId;
