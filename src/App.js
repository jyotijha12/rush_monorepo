import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AppBar from "./Containers/AppBar/AppBar";
import BTITool from "./Views/BTI/BTITool";
import ChangePassword from "./Views/ChangePassword/ChangePassword";
import Login from "./Views/Login/Login";
import RecentApplications from "./Views/RecentApplications/RecentApplications";
import Tableau from "./Views/Tableau/Tableau";

const App = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const pathname = window.location.pathname;

    if (isLoggedIn === "true" && pathname === `/absa`) {
      window.location.pathname = `/absa/recent-applications`;
    } else if (isLoggedIn !== "true" && pathname !== `/absa`) {
      window.location.pathname = `/absa`;
    }
    setLoading(false);
  }, []);

  const loginUser = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/recent-applications");
  };

  const logoutUser = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.pathname = `/absa`;
  };

  return (
    <Box>
      <AppBar logoutUser={logoutUser} />
      {!loading ? (
        window.location.pathname === `/absa` ? (
          <Login loginUser={loginUser} />
        ) : (
          <Box>
            <Routes>
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
