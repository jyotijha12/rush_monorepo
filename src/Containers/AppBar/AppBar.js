import { Box, Flex, Image, Text } from "@chakra-ui/react";
import ABSA from "../../Resources/ABSALogo.svg";
import EXL from "../../Resources/EXLLogo.svg";
import Lock from "../../Resources/CircleLock.svg";
import Logout from "../../Resources/SignOutLogout.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const styles = useStyles();
  const navigate = useNavigate();

  const logoutUser = () => {
    const token = JSON.parse(sessionStorage.getItem("token"))["data"];

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BASE_AUTHENTICATION_URL}/auth/user_logout/`,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        custom: `Bearer ${token.access_token}`,
      },
    };
    axios
      .request(config)
      .then(() => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("token");
        window.location.pathname = `/absa`;
      })
      .catch(() => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("token");
        window.location.pathname = `/absa`;
      });
  };

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
                  cursor={window.location.pathname !== "/absa" ? "pointer" : ""}
                  onClick={() =>
                    window.location.pathname !== "/absa"
                      ? navigate("/recent-applications")
                      : {}
                  }
                />
              </Box>
              <Text variant="body7" color="custom.main">
                BTI Portal
              </Text>
            </Flex>
            {window.location.pathname !== "/absa" && (
              <Flex
                mr={20}
                gap={6}
                justifyContent="flex-end"
                alignItems="center"
                w="100%"
              >
                <Flex
                  gap={2}
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => navigate("change-password")}
                >
                  <Text variant="body6" color="custom.main">
                    Change password
                  </Text>
                  <Box h="25px">
                    <Image src={Lock} h="100%" />
                  </Box>
                </Flex>
                <Flex
                  gap={2}
                  justifyContent="center"
                  alignItems="center"
                  onClick={logoutUser}
                  cursor="pointer"
                >
                  <Text variant="body6" color="custom.main">
                    Logout
                  </Text>
                  <Box h="25px">
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
