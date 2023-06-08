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
        h="73vh"
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
                    <Td>{item.application_id}</Td>
                    <Td textAlign="center">{item.instance_id}</Td>
                    <Td>{item.user}</Td>
                    <Td>{item.status}</Td>
                    <Td>{item.error_warning}</Td>
                    <Td>
                      {item.status === "Complete" ? (
                        <Text
                          textDecoration="underline"
                          cursor="pointer"
                          onClick={() => navigate("/bti-tool/tableau")}
                        >
                          View details
                        </Text>
                      ) : item.status === "Saved" ? (
                        <Text
                          textDecoration="underline"
                          cursor="pointer"
                          onClick={() => navigate("/bti-tool")}
                        >
                          Process Request
                        </Text>
                      ) : null}
                    </Td>
                    <Td>
                      {moment(item.modified_at).format("YYYY-MM-DD HH:mm:ss")}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          ) : (
            <TableCaption h="65vh">
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
              <Heading size="sm" p={5}>
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
