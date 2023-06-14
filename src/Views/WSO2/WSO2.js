import { Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const WSO2 = (props) => {
  const query = useQuery();
  const toast = useToast();
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  useEffect(() => {
    const code = query.get("code");

    const formData = new FormData();
    formData.append("code", code);
    formData.append("redirect_uri", process.env.REACT_APP_REDIRECT_URI);

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BASE_AUTHENTICATION_URL}/auth/user_login/`,
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        sessionStorage.setItem("token", JSON.stringify(response.data.data));
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.assign(`/absa/recent-applications`);
      })
      .catch(() => {
        toast({
          title: "Login Failed.",
          description: "You will be redirected to login page in 5 seconds.",
          status: "error",
          duration: 5000,
          isClosable: false,
        });
        window.location.pathname = "/absa";
      });

    // eslint-disable-next-line
  }, []);
  return <Text>Loading...</Text>;
};

export default WSO2;
