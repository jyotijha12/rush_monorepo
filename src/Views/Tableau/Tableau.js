import { useMemo, useState } from "react";
import TableauReport from "tableau-react";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import "../../css/tableau.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";

const inputdata_consumer =
  "https://analytics.ebrain.couture.ai/views/TestGraph/Dashboard1?:origin=card_share_link&:embed=n";
const solution_output_transaction_consumer = `${window.REACT_APP_TABLEAU_SERVER_URL}/views/ConsumerCommercial_v1/SolutionOutput-TransactionLevel?:jsdebug=y&:comments=no&:refresh=yes&:display_count=n&:showVizHome=n&:origin=viz_share_link`;
const solution_output_tradeline_consumer = `${window.REACT_APP_TABLEAU_SERVER_URL}/views/ConsumerCommercial_v1/SolutionOutput-Tradelinelevel?:jsdebug=y&:comments=no&:refresh=yes&:display_count=n&:showVizHome=n&:origin=viz_share_link`;
const solution_output_customerlevel_consumer = `${window.REACT_APP_TABLEAU_SERVER_URL}/views/ConsumerCommercial_v1/SolutionOutput-Customerlevel?:jsdebug=y&:comments=no&:refresh=yes&:display_count=n&:showVizHome=n&:origin=viz_share_link`;

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
        return <TableauComponent page={page} pageurl={inputdata_consumer} />;
      case "Solutions Output-Transaction Level":
        return (
          <TableauComponent
            page={page}
            pageurl={solution_output_transaction_consumer}
          />
        );
      case "Customer Bank Application Overview":
        return (
          <TableauComponent
            page={page}
            pageurl={solution_output_tradeline_consumer}
          />
        );
      case "Customer Transactions Summary":
        return (
          <TableauComponent
            page={page}
            pageurl={solution_output_tradeline_consumer}
          />
        );
      case "Customer Insights - Expenses":
        return (
          <TableauComponent
            page={page}
            pageurl={solution_output_customerlevel_consumer}
          />
        );

      default:
        return <TableauComponent page={page} pageurl={inputdata_consumer} />;
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
