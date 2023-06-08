import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  return (
    <Flex justifyContent="center" alignItems="center" h="600px">
      <Flex
        w="70%"
        h="540px"
        border="4px solid"
        borderColor="primary.main"
        borderRadius="40px"
        flexDir="column"
      >
        <Flex
          alignItems="center"
          pl={14}
          pt="50px"
          justifyContent="space-between"
        >
          <ArrowBackRoundedIcon
            onClick={() => navigate(-1)}
            style={{
              cursor: "pointer",
              color: "#455468",
            }}
          />
          <Text pr={14} variant="body2" textAlign="center">
            Change Password
          </Text>
          <Text>{"  "}</Text>
        </Flex>
        <Flex
          mt={8}
          gap={7}
          flexDir="column"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Input placeholder="Username" variant="flushed" w="60%" />
          <Input placeholder="Current Password" variant="flushed" w="60%" />
          <Input placeholder="Create New Password" variant="flushed" w="60%" />
          <Input placeholder="Confirm New Password" variant="flushed" w="60%" />
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          mt={14}
        >
          <Box>
            <Button w="260px">Submit</Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChangePassword;
