import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppBar from "./Containers/AppBar/AppBar";
import { getCSRF } from "./utils/Api/getCSRF";
import { getVaultData } from "./utils/Api/getVaultData";
import {
  setAuthorizationToken,
  setCSRFToken,
} from "./utils/Axios/axiosInstance";
import { isTokenExpired } from "./utils/JWT/isTokenExpired";
import BTITool from "./Views/BTI/BTITool";
import Login from "./Views/Login/Login";
import RecentApplications from "./Views/RecentApplications/RecentApplications";
import Tableau from "./Views/Tableau/Tableau";
import WSO2 from "./Views/WSO2/WSO2";

const App = () => {
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    getCSRF();

    const token = JSON.parse(sessionStorage.getItem("token"));
    const csrfToken = sessionStorage.getItem("CSRF");

    if (token) {
      setAuthorizationToken(token.access_token);
      getVaultData();
    }
    if (csrfToken) {
      setCSRFToken(csrfToken);
    }

    localStorage.setItem("chakra-ui-color-mode", "light");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const pathname = window.location.pathname;

    if (
      (isLoggedIn === "true" && pathname === `/absa`) ||
      (pathname === `/absa/` && token)
    ) {
      window.location.pathname = `/absa/recent-applications`;
    } else if (
      isLoggedIn !== "true" &&
      pathname !== `/absa` &&
      pathname !== "/absa/wso2login" &&
      !token
    ) {
      window.location.pathname = `/absa`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      const interval = setInterval(() => {
        if (isTokenExpired(token.access_token)) {
          clearInterval(interval);
          toast({
            title: "Session Expired",
            description: "Session expired redirecting to login page.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          sessionStorage.removeItem("isLoggedIn");
          sessionStorage.removeItem("token");
          window.location.pathname = `/absa`;
        }
      }, 5000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [window.location.pathname]);

  return (
    <Box>
      <AppBar />
      {!loading ? (
        window.location.pathname === `/absa` ? (
          <Login />
        ) : (
          <Box>
            <Routes>
              <Route path="/wso2login" element={<WSO2 />} />
              <Route path="/bti-tool" element={<BTITool />} />
              <Route path="/bti-tool/tableau" element={<Tableau />} />
              <Route
                path="/recent-applications"
                element={<RecentApplications />}
              />
            </Routes>
          </Box>
        )
      ) : null}
    </Box>
  );
};

export default App;
