import axios from "axios";

const requestPost = async (url, body = {}) => {
  try {
    let res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("access_token"),
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export default requestPost;
