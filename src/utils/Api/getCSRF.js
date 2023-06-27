import axios from "axios";

export const getCSRF = () => {
  let config = {
    method: "get",
    url: `${process.env.REACT_APP_BASE_AUTHENTICATION_URL}/auth/get_csrf/`
  };

  axios
    .request(config)
    .then((response) => {
      console.log("getting the token from backend",JSON.stringify(response.data.data));
      sessionStorage.setItem('CSRF',response.data.data)
    })
    .catch((error) => {
      console.error("Failed to get CSRF token:", error);
    });
};
