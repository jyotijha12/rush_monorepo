import { createStandaloneToast } from "@chakra-ui/react";
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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { toast } = createStandaloneToast();
    if (error.response && error.response.status === 403) {
      toast({
        title: "Session Expired",
        description: "Redirecting to login page!!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("token");
      setTimeout(() => {
        window.location.pathname = `${process.env.REACT_APP_BASENAME}`;
      }, 2000);
    }

    throw error;
  }
);

const setCSRFToken = (csrfToken) => {
  if (csrfToken) {
    axiosInstance.defaults.headers.common["X-CSRFToken"] = csrfToken;
  } else {
    delete axiosInstance.defaults.headers.common["X-CSRFToken"];
  }
};

export { setAuthorizationToken, setCSRFToken, axiosInstance };
