import { Box, Flex, Image, Text } from "@chakra-ui/react";
import ABSA from "../../Resources/ABSALogo.svg";
import EXL from "../../Resources/EXLLogo.svg";
import Lock from "../../Resources/CircleLock.svg";
import Logout from "../../Resources/SignOutLogout.svg";
import { useNavigate } from "react-router-dom";

const useStyles = () => ({
  appbar: {
    position: "fixed",
    zIndex: 999,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    paddingRight: "60px",
    paddingLeft: "60px",
    transition: "0.5s",
    height: "80px",
    background: "#FFFFFF",
    boxShadow: "0px 2px 2px #D9D9D9",
  },
});

const AppBar = (props) => {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <Box w="100%">
      <Box sx={styles.appbar}>
        <Flex gap={4} alignItems="center">
          <Box>
            <Image src={ABSA} />
          </Box>
          <Text variant="body1" color="custom.main">
            Everyday Banking
          </Text>
        </Flex>
        <Flex gap={1} alignItems="baseline">
          <Text variant="body4">powered by</Text>
          <Box>
            <Image src={EXL} />
          </Box>
        </Flex>
      </Box>

      <Box pt="86px" pr={14}>
        {window.location.pathname !== "/" && (
          <Flex gap={6} justifyContent="flex-end" alignItems="center">
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
              <Box>
                <Image src={Lock} />
              </Box>
            </Flex>
            <Flex
              gap={2}
              justifyContent="center"
              alignItems="center"
              onClick={props.logoutUser}
              cursor="pointer"
            >
              <Text variant="body6" color="custom.main">
                Logout
              </Text>
              <Box>
                <Image src={Logout} />
              </Box>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default AppBar;
