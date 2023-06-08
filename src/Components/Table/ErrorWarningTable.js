import {
  Card,
  Divider,
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

const ErrorWarningTable = (props) => {
  return (
    <Card borderTop="8px solid" borderColor="primary.main">
      <Flex h={10} alignItems="center" justifyContent="center">
        <Text textAlign="center" fontSize="20px" fontWeight={600}>
          {props.tableName}
        </Text>
      </Flex>
      <Divider borderColor="custom.light" />
      <TableContainer
        h="43vh"
        style={{ overflow: "auto" }}
        borderColor="custom.main"
      >
        <Table variant="simple" size="sm">
          <Thead bg="white" sx={{ position: "sticky", top: 0, zIndex: 900 }}>
            <Tr sx={{ position: "sticky", top: 0 }}>
              {props.heading.map((item, i) => {
                return (
                  <Th
                    h={10}
                    color="primary.main"
                    key={i}
                    sx={{ position: "sticky", top: 0 }}
                    textAlign="center"
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
                    <Td>
                      <Text textAlign="center">
                        {props.tableName === "Errors"
                          ? item.error_code
                          : item.warning_code}
                      </Text>
                    </Td>
                    <Td>
                      <Text textAlign="center">
                        {props.tableName === "Errors"
                          ? item.error_message
                          : item.warning_message}
                      </Text>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          ) : (
            <TableCaption h="35vh">
              <Flex h="100%" justifyContent="center" alignItems="center">
                <Text>No data exist!!</Text>
              </Flex>
            </TableCaption>
          )}
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ErrorWarningTable;
