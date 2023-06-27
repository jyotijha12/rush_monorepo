import axios from "axios";

export const getCSRF = () => {
  let config = {
    method: "get",
    url: `${process.env.REACT_APP_BASE_AUTHENTICATION_URL}/auth/get_csrf/`,
    withCredentials: true,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      // sessionStorage.setItem('CSRF',response.data.data)
    })
    .catch(() => {});
};
