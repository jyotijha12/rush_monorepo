import { useMemo, useState } from "react";
import TableauReport from "tableau-react";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import "../../css/tableau.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";

const digitized_data =
  "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/Digitizeddata?:origin=card_share_link&:embed=n";
const transaction_level_output =
  "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/Transactionleveloutput?:origin=card_share_link&:embed=n";
const bank_application_overview =
  "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/ApplicationOverview?:origin=card_share_link&:embed=n";
const customer_transaction_summary =
  "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/Summary-Transactions?:origin=card_share_link&:embed=n";
const customer_insights_income =
  "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/IncomeOverview?:origin=card_share_link&:embed=n";
const customer_insights_expenses =
  "https://analytics.ebrain.couture.ai/views/20220523_BTI_UI_OutputScreens_ID1/ExpenseOverview?:origin=card_share_link&:embed=n";

const options = {
  height: window.screen.height < 768 ? 300 : window.screen.height - 300,
  width: window.screen.width < 1094 ? 750 : 1024,
  hideTabs: true,
  device: "desktop",
};

const TableauComponent = (props) => {
  const filters = {
    "Tradeline subtype": ["PERSONAL LOAN PAYMENT", "OTHER DEBT OBLIGATION"],
  };

  return (
    <Box className="tabluecomponent">
      <TableauReport
        options={options}
        url={props.pageurl}
        filters={filters}
        onLoad={(report) => console.log(report)}
      />
    </Box>
  );
};

const leftNavConfig = [
  { label: "Digitized Bank Data Statement" },
  { label: "Solutions Output-Transaction Level" },
  { label: "Customer Bank Application Overview" },
  { label: "Customer Transactions Summary" },
  { label: "Customer Insights - Income" },
  { label: "Customer Insights - Expenses" },
];
const Tableau = () => {
  const [page, setPage] = useState("Digitized Bank Data Statement");
  const navigate = useNavigate();

  let tabContent = useMemo(() => {
    switch (page) {
      case "Digitized Bank Data Statement":
        return <TableauComponent page={page} pageurl={digitized_data} />;
      case "Solutions Output-Transaction Level":
        return (
          <TableauComponent page={page} pageurl={transaction_level_output} />
        );
      case "Customer Bank Application Overview":
        return (
          <TableauComponent page={page} pageurl={bank_application_overview} />
        );
      case "Customer Transactions Summary":
        return (
          <TableauComponent
            page={page}
            pageurl={customer_transaction_summary}
          />
        );
      case "Customer Insights - Income":
        return (
          <TableauComponent page={page} pageurl={customer_insights_income} />
        );
      case "Customer Insights - Expenses":
        return (
          <TableauComponent page={page} pageurl={customer_insights_expenses} />
        );

      default:
        return <TableauComponent page={page} pageurl={digitized_data} />;
    }
  }, [page]);

  return (
    <Box w="100%">
      <Box className="tablue-container">
        <Box className="tablueLeft">
          {leftNavConfig.map(({ label }, i) => (
            <button
              key={i}
              className={label === page ? "active" : ""}
              onClick={() => {
                setPage(label);
              }}
            >
              <Text
                lineHeight="20px"
                py={1}
                color={label === page ? "secondary.main" : "custom.main"}
                variant="body6"
                textAlign="left"
              >
                {label}
              </Text>
            </button>
          ))}
          <Divider mt={8} mb={6} />
          <Flex
            alignItems="center"
            gap={4}
            pl={6}
            cursor="pointer"
            onClick={() => navigate("/bti-tool")}
          >
            <HomeOutlinedIcon
              style={{
                color: "#455468",
              }}
            />
            <Text variant="body6">BTI Tool</Text>
          </Flex>
        </Box>
        <Box className="tablueright">{tabContent}</Box>
      </Box>
    </Box>
  );
};

export default Tableau;
