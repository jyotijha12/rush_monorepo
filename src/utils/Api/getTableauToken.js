import { axiosInstance } from "../Axios/axiosInstance";

export const getTableauToken = async () => {
  try {
    const config = {
      method: "post",
      url: `/api/get_tableau_token/`,
    };

    const response = await axiosInstance.request(config);
    return response.data;
  } catch (e) {}
};
