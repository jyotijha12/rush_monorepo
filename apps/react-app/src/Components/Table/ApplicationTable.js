import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useEffect, useState } from "react";
import moment from "moment";

const ApplicationTable = (props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalData, setTotalData] = useState(props.data);

  const navigate = useNavigate();

  const paginate = () => {
    const data = props.data;

    const start = page * pageSize - pageSize;
    const end = page * pageSize;
    setPaginatedData(data.slice(start, end));
    setTotalData(data);
  };

  useEffect(() => {
    paginate();
    if (props.data.length > 0) {
      setTotalData(props.data);
    }
    // eslint-disable-next-line
  }, [props.data]);

  useEffect(() => {
    if (pageSize) {
      paginate();
    }
    // eslint-disable-next-line
  }, [pageSize, page]);

  return (
    <>
      <TableContainer
        h="70vh"
        style={{ overflow: "auto" }}
        border="1px solid"
        borderColor="custom.main"
      >
        <Table variant="simple">
          <Thead bg="white" sx={{ position: "sticky", top: 0, zIndex: 900 }}>
            <Tr sx={{ position: "sticky", top: 0 }}>
              {props.heading.map((item, i) => {
                return (
                  <Th
                    color="primary.main"
                    key={i}
                    sx={{ position: "sticky", top: 0 }}
                  >
                    {item}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          {paginatedData.length > 0 ? (
            <Tbody>
              {paginatedData.map((item, i) => {
                return (
                  <Tr key={i}>
                    <Td fontSize="13.5px">
                      <Tooltip hasArrow label={item.application_id}>
                        {`${item.application_id.substring(0, 10)} 
                          ${item.application_id.length > 10 ? "..." : ""}`}
                      </Tooltip>
                    </Td>
                    <Td fontSize="13.5px" textAlign="center">
                      {item.instance_id}
                    </Td>
                    <Td fontSize="13.5px">{item.user}</Td>
                    <Td fontSize="13.5px">{item.status}</Td>
                    <Td fontSize="13.5px">
                      {item.errors.length > 0 || item.warnings.length > 0
                        ? item.errors.length > 0
                          ? "Error"
                          : "Warning"
                        : "No Error"}
                    </Td>
                    <Td>
                      {item.status === "Complete" ? (
                        <Text
                          fontSize="13.5px"
                          textDecoration="underline"
                          cursor="pointer"
                          onClick={() =>
                            navigate(
                              `${process.env.REACT_APP_BTI_SOLUTION}${process.env.REACT_APP_TABLEAU}`,
                              {
                                state: {
                                  rowData: item,
                                },
                              }
                            )
                          }
                        >
                          View details
                        </Text>
                      ) : item.status === "Saved" ? (
                        <Text
                          fontSize="13.5px"
                          textDecoration="underline"
                          cursor="pointer"
                          onClick={() =>
                            navigate(`${process.env.REACT_APP_BTI_SOLUTION}`, {
                              state: {
                                rowData: item,
                              },
                            })
                          }
                        >
                          Process Request
                        </Text>
                      ) : (
                        <Text fontSize="13.5px">Processing...</Text>
                      )}
                    </Td>
                    <Td fontSize="13.5px">
                      {moment
                        .utc(item.modified_at)
                        .subtract(2, "hours")
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          ) : (
            <TableCaption h="60vh">
              <Flex h="100%" justifyContent="center" alignItems="center">
                <Text>No data exist!!</Text>
              </Flex>
            </TableCaption>
          )}
        </Table>
      </TableContainer>
      {props.data && props.data.length !== 0 && (
        <Box border="1px solid" borderTop="none" borderColor="custom.main">
          <Divider />
          <Flex alignItems="center" ml={5}>
            {`Showing  ${(page - 1) * pageSize + 1} to  ${
              props.data.length < pageSize * page
                ? props.data.length
                : pageSize && pageSize * page
            } of ${props.data.length} records`}
            <Spacer />
            <Flex justifyContent="flex-end" alignItems="center" mr={5}>
              <Text variant="Body2Regular">Display</Text>
              <NumberInput
                ml={2}
                mr={4}
                step={1}
                defaultValue={pageSize}
                min={1}
                max={30}
                w="70px"
                size="sm"
                borderRadius="8px"
                onChange={(e) => {
                  setPageSize(e);
                }}
              >
                <NumberInputField borderRadius="8px" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Text variant="Body2Regular">records</Text>
              <Box h="40px" mx={4}>
                <Divider orientation="vertical" />
              </Box>
              <IconButton
                onClick={() => page !== 1 && setPage(page - 1)}
                disabled={page === 1}
                size="sm"
                variant="iconOutline"
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
              <Heading color="custom.main" size="sm" p={5}>
                Page {page} of {Math.ceil(totalData.length / pageSize)}
              </Heading>
              <IconButton
                variant="iconOutline"
                onClick={() =>
                  page !== Math.ceil(props.data.length / pageSize) &&
                  setPage(page + 1)
                }
                disabled={page === Math.ceil(props.data.length / pageSize)}
                size="sm"
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default ApplicationTable;
