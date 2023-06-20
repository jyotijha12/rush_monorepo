import TableauReport from "tableau-react";
import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import ErrorWarningTable from "../../Components/Table/ErrorWarningTable";
import { useEffect, useState } from "react";

const options = {
  height: window.screen.height < 768 ? 300 : window.screen.height - 300,
  width: window.screen.width < 1094 ? 750 : 1024,
  hideTabs: true,
  device: "desktop",
};

const Tableau = () => {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  const tabList = {
    "Digitized Bank Statement Data": `${process.env.REACT_APP_TABLEAU_SERVER_URL}/views/20220523_BTI_UI_OutputScreens_ID1/Digitizeddata?:origin=card_share_link&:embed=n`,
    "Application Overview": `${process.env.REACT_APP_TABLEAU_SERVER_URL}/views/20220523_BTI_UI_OutputScreens_ID1/ApplicationOverview?:origin=card_share_link&:embed=n`,
    "Transaction Output": `${process.env.REACT_APP_TABLEAU_SERVER_URL}/views/20220523_BTI_UI_OutputScreens_ID1/Transactionleveloutput?:origin=card_share_link&:embed=n`,
    "Transactions Summary": `${process.env.REACT_APP_TABLEAU_SERVER_URL}/views/20220523_BTI_UI_OutputScreens_ID1/Summary-Transactions?:origin=card_share_link&:embed=n`,
    "Customer Insights - Income": `${process.env.REACT_APP_TABLEAU_SERVER_URL}/views/20220523_BTI_UI_OutputScreens_ID1/IncomeOverview?:origin=card_share_link&:embed=n`,
    "Customer Insights - Expenses": `${process.env.REACT_APP_TABLEAU_SERVER_URL}/views/20220523_BTI_UI_OutputScreens_ID1/ExpenseOverview?:origin=card_share_link&:embed=n`,
    "Errors & Warnings": "",
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (!location.state) {
      navigate("/recent-applications");
    } else {
      setErrors(location.state.rowData.errors);
      setWarnings(location.state.rowData.warnings);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <Box w="100%">
      <Tabs
        defaultIndex={
          location.state
            ? location.state.rowData.errors.length > 0 ||
              location.state.rowData.warnings.length > 0
              ? Object.keys(tabList).length - 1
              : 0
            : 0
        }
      >
        <TabList>
          {Object.keys(tabList).map((tab, i) => {
            return (
              <Tab
                isDisabled={
                  tab !== "Errors & Warnings" && errors.length > 0
                    ? true
                    : false
                }
                fontSize="14px"
                key={i}
                color="primary.main"
                _selected={{
                  fontWeight: "700",
                  color: theme.colors.primary.main,
                  borderBottom: `4px solid ${theme.colors.primary.main}`,
                }}
              >
                {tab}
              </Tab>
            );
          })}
        </TabList>

        <TabPanels>
          {Object.values(tabList).map((value, i) => {
            return (
              <TabPanel key={i}>
                <Flex w="100%" px={20} py={10} justifyContent="center">
                  {value !== "" ? (
                    <Flex gap={8} flexDir="column">
                      <TableauReport options={options} url={value} />
                      <Flex justifyContent="flex-end">
                        <Button
                          w="20%"
                          onClick={() => navigate("/recent-applications")}
                        >
                          Done
                        </Button>
                      </Flex>
                    </Flex>
                  ) : (
                    <Flex w="100%" flexDir="column" gap={8}>
                      <Text fontSize="18px" fontWeight={600} textAlign="left">
                        Errors & Warnings
                      </Text>

                      {errors.length === 0 && warnings.length === 0 ? (
                        <Flex w="100%" mt={4}>
                          <Text textAlign="left" fontWeight={600}>
                            <li>There are no errors/warnings</li>
                          </Text>
                        </Flex>
                      ) : (
                        <>
                          <Box>
                            {errors.length > 0 && (
                              <ErrorWarningTable
                                tableName="Errors"
                                data={errors}
                                heading={[
                                  "Error Title",
                                  "Error Code",
                                  "Error Description",
                                ]}
                              />
                            )}

                            {warnings.length > 0 && (
                              <ErrorWarningTable
                                tableName="Warnings"
                                data={warnings}
                                heading={[
                                  "Warning Title",
                                  "Warning Code",
                                  "Warning Description",
                                ]}
                              />
                            )}
                          </Box>
                          <Flex justifyContent="flex-end">
                            <Button
                              w="20%"
                              onClick={() => navigate("/recent-applications")}
                            >
                              Done
                            </Button>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  )}
                </Flex>
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Tableau;
