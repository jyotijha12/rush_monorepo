import TableauReport from "tableau-react";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import ErrorWarningTable from "../../Components/Table/ErrorWarningTable";
import { useEffect, useState } from "react";
import { getTableauToken } from "../../utils/Api/getTableauToken";

const Tableau = () => {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [trustedToken, setTrustedToken] = useState("");
  const [selectedTab, setSelectedTab] = useState();
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tabList] = useState({
    "Customer Insights - Expenses": `${process.env.REACT_APP_CUSTOMER_INSIGHTS_EXPENSE}`,
    "Application Overview": `${process.env.REACT_APP_APPLICATION_OVERVIEW}`,
    "Transaction Output": `${process.env.REACT_APP_TRANSACTION_OUTPUT}`,
    "Transactions Summary": `${process.env.REACT_APP_TRANSACTIONS_SUMMARY}`,
    "Digitized Bank Statement Data": `${process.env.REACT_APP_DIGITIZED_BANK_STATEMENT_DATA}`,
    "Errors & Warnings": "",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  const options = {
    height: 1024,
    width: 1024,
    hideTabs: true,
    device: "desktop",
    required_application_id: location.state.rowData.application_id,
    required_unique_instance_id: location.state.rowData.application_id,
  };

  const getData = async () => {
    if (!tokenLoading) setTokenLoading(true);
    const token = await getTableauToken();
    setTrustedToken(token ? token : "");
    setTokenLoading(false);
  };

  useEffect(() => {
    if (selectedTab === Object.keys(tabList).length - 1) setTokenLoading(false);
    if (selectedTab || selectedTab === 0) {
      if (selectedTab !== Object.keys(tabList).length - 1) {
        getData();
      }
    }
    // eslint-disable-next-line
  }, [selectedTab]);

  useEffect(() => {
    setSelectedTab(
      location.state
        ? location.state.rowData.errors.length > 0 ||
          location.state.rowData.warnings.length > 0
          ? Object.keys(tabList).length - 1
          : 0
        : 0
    );

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (!location.state) {
      navigate(`${process.env.REACT_APP_HOME}`);
    } else {
      setErrors(location.state.rowData.errors);
      setWarnings(location.state.rowData.warnings);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <Box w="100%">
      <Tabs
        onChange={(index) => {
          if (index !== Object.keys(tabList).length - 1) setTokenLoading(true);
          setSelectedTab(index);
        }}
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

        <Box>
          {tokenLoading ? (
            <Flex
              w="100%"
              px={20}
              py={10}
              h="80vh"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress isIndeterminate color="primary.main" />
            </Flex>
          ) : (
            <Flex w="100%" px={20} py={10} justifyContent="center">
              {tabList[Object.keys(tabList)[selectedTab]] !== "" ? (
                <Flex gap={8} flexDir="column">
                  <TableauReport
                    options={options}
                    url={tabList[Object.keys(tabList)[selectedTab]]}
                    token={trustedToken}
                  />
                  <Flex justifyContent="flex-end">
                    <Button
                      w="20%"
                      onClick={() => navigate(`${process.env.REACT_APP_HOME}`)}
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
                          onClick={() =>
                            navigate(`${process.env.REACT_APP_HOME}`)
                          }
                        >
                          Done
                        </Button>
                      </Flex>
                    </>
                  )}
                </Flex>
              )}
            </Flex>
          )}
        </Box>
      </Tabs>
    </Box>
  );
};

export default Tableau;
