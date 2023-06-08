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
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import ErrorWarningTable from "../../Components/Table/ErrorWarningTable";

const options = {
  height: window.screen.height < 768 ? 300 : window.screen.height - 300,
  width: window.screen.width < 1094 ? 750 : 1024,
  hideTabs: true,
  device: "desktop",
};

const Tableau = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const tabList = {
    "Digitized Bank Statement Data":
      "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/Digitizeddata?:origin=card_share_link&:embed=n",
    "Application Overview":
      "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/ApplicationOverview?:origin=card_share_link&:embed=n",
    "Transaction Output":
      "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/Transactionleveloutput?:origin=card_share_link&:embed=n",
    "Transactions Summary":
      "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/Summary-Transactions?:origin=card_share_link&:embed=n",
    "Customer Insights - Income":
      "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/IncomeOverview?:origin=card_share_link&:embed=n",
    "Customer Insights - Expenses":
      "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/ExpenseOverview?:origin=card_share_link&:embed=n",
    "Errors & Warnings": "",
  };

  const data = {
    errors: [
      { id: 1, error_code: "E01", error_message: "Poor quality documents" },
    ],
    warnings: [
      {
        id: 1,
        warning_code: "W01",
        warning_message: "Documents uploaded are duplicate",
      },
    ],
  };

  return (
    <Box w="100%">
      <Tabs>
        <TabList>
          {Object.keys(tabList).map((tab, i) => {
            return (
              <Tab
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
                      <Text variant="body8" textAlign="left">
                        Errors & Warnings
                      </Text>

                      <ErrorWarningTable
                        tableName="Errors"
                        data={data["errors"]}
                        heading={["Error Code", "Error Description"]}
                      />

                      <ErrorWarningTable
                        tableName="Warnings"
                        data={data["warnings"]}
                        heading={["Warning Code", "Warning Description"]}
                      />

                      <Flex justifyContent="flex-end">
                        <Button
                          w="20%"
                          onClick={() => navigate("/recent-applications")}
                        >
                          Done
                        </Button>
                      </Flex>
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
