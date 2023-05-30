import {
  Flex,
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

const ApplicationTable = (props) => {
  const navigate = useNavigate();

  return (
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
        {props.data.length > 0 ? (
          <Tbody>
            {props.data.map((item, i) => {
              return (
                <Tr key={i}>
                  <Td>{item.application_number}</Td>
                  <Td>{item.instance_number}</Td>
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
                    ) : (
                      <Text
                        textDecoration="underline"
                        cursor="pointer"
                        onClick={() => navigate("/bti-tool")}
                      >
                        Process Request
                      </Text>
                    )}
                  </Td>
                  <Td>{item.last_updated}</Td>
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
  );
};

export default ApplicationTable;
