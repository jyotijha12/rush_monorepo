import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AppBar from "./Containers/AppBar/AppBar";
import { getVaultData } from "./utils/Api/getVaultData";
import { setAuthorizationToken } from "./utils/Axios/axiosInstance";
import { isTokenExpired } from "./utils/JWT/isTokenExpired";
import BTITool from "./Views/BTI/BTITool";
import ChangePassword from "./Views/ChangePassword/ChangePassword";
import Login from "./Views/Login/Login";
import RecentApplications from "./Views/RecentApplications/RecentApplications";
import Tableau from "./Views/Tableau/Tableau";
import WSO2 from "./Views/WSO2/WSO2";

const App = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      setAuthorizationToken(token.access_token);
      getVaultData();
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
          navigate("/absa");
        }
      }, 5000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [navigate]);

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
              <Route path="/change-password" element={<ChangePassword />} />
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
