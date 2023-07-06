import axios from "axios";

export const getCSRF = async () => {
  let config = {
    method: "get",
    url: `${process.env.REACT_APP_BASE_AUTHENTICATION_URL}/auth/get_csrf/`,
  };

  let response = await axios.request(config);
  sessionStorage.setItem("CSRF", response.data.data);
};
