import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import ABSA from "../../Resources/ABSALogo.svg";
import EXL from "../../Resources/EXLLogo.svg";
import Logout from "../../Resources/SignOutLogout.svg";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/Axios/axiosInstance";
import { useEffect, useState } from "react";
import moment from "moment";
import { parseJwt } from "../../utils/JWT/parseJwt";

const useStyles = () => ({
  appbar: {
    position: "fixed",
    zIndex: 999,
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "12px 24px",
    paddingRight: "10px",
    paddingLeft: "50px",
    transition: "0.5s",
    height: "80px",
    background: "#FFFFFF",
    boxShadow: "0px 2px 2px #D9D9D9",
  },
});

const AppBar = () => {
  const [greeting, setGreeting] = useState("");

  const styles = useStyles();
  const navigate = useNavigate();

  const logoutUser = () => {
    let config = {
      method: "post",
      url: `/auth/user_logout/`,
    };
    axiosInstance
      .request(config)
      .then(() => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("token");
        window.location.pathname = `${process.env.REACT_APP_BASENAME}`;
      })
      .catch(() => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("token");
        window.location.pathname = `${process.env.REACT_APP_BASENAME}`;
      });
  };

  useEffect(() => {
    updateGreeting();

    const timerInterval = setInterval(() => {
      updateGreeting();
    }, 30000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const updateGreeting = () => {
    const currentTime = moment().subtract(2, "hours");

    if (
      currentTime.isBetween(
        currentTime.clone().startOf("day"),
        currentTime.clone().startOf("day").add(12, "hours")
      )
    ) {
      setGreeting("Good Morning");
    } else if (
      currentTime.isBetween(
        currentTime.clone().startOf("day").add(12, "hours"),
        currentTime.clone().startOf("day").add(17, "hours")
      )
    ) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  const token = JSON.parse(sessionStorage.getItem("token"));

  return (
    <Box w="100%" pb="90px">
      <Box sx={styles.appbar}>
        <Flex alignItems="center" flexDir="column" w="100%">
          <Flex alignItems="center" justifyContent="flex-end" w="100%">
            <Flex alignItems="baseline" gap={2}>
              <Text variant="body4">powered by</Text>
              <Box h="12px">
                <Image src={EXL} h="100%" />
              </Box>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Flex alignItems="center" w="100%" gap={8}>
              <Box h="50px">
                <Image
                  src={ABSA}
                  h="100%"
                  cursor={
                    window.location.pathname !==
                    `${process.env.REACT_APP_BASENAME}`
                      ? "pointer"
                      : ""
                  }
                  onClick={() =>
                    window.location.pathname !==
                    `${process.env.REACT_APP_BASENAME}`
                      ? navigate(`${process.env.REACT_APP_HOME}`)
                      : {}
                  }
                />
              </Box>
              <Text variant="body7" color="custom.main">
                BTI Portal
              </Text>
            </Flex>

            {window.location.pathname !==
              `${process.env.REACT_APP_BASENAME}` && (
              <Flex
                mr={20}
                gap={6}
                justifyContent="flex-end"
                alignItems="center"
                w="100%"
              >
                <Flex
                  gap={2}
                  justifyContent="flex-end"
                  w="100%"
                  alignItems="center"
                >
                  <Text>{greeting}</Text>
                  <Text>{token && parseJwt(token.access_token).sub}</Text>
                  <Avatar size="xs" src="https://bit.ly/broken-link" />
                </Flex>
                <Flex
                  h="25px"
                  gap={2}
                  justifyContent="center"
                  alignItems="center"
                  onClick={logoutUser}
                  cursor="pointer"
                  mr={2}
                >
                  <Text variant="body6" color="custom.main">
                    Logout
                  </Text>
                  <Box h="40px">
                    <Image src={Logout} h="100%" />
                  </Box>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default AppBar;
