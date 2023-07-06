import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  withCredentials: true,
});

const setAuthorizationToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const setCSRFToken = (csrfToken) => {
  if (csrfToken) {
    axiosInstance.defaults.headers.common["X-CSRFToken"] = csrfToken;
  } else {
    delete axiosInstance.defaults.headers.common["X-CSRFToken"];
  }
};

export { setAuthorizationToken, setCSRFToken, axiosInstance };
