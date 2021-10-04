import axios from "axios";

export const getJSON = async (url: string, token: string | undefined) => {
  return axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      return err.response.data;
    });
};
