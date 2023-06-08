import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppBar from "./Containers/AppBar/AppBar";
import BTITool from "./Views/BTI/BTITool";
import ChangePassword from "./Views/ChangePassword/ChangePassword";
import Login from "./Views/Login/Login";
import RecentApplications from "./Views/RecentApplications/RecentApplications";
import Tableau from "./Views/Tableau/Tableau";
import WSO2 from "./Views/WSO2/WSO2";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const pathname = window.location.pathname;
    const token = localStorage.getItem("token");

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
