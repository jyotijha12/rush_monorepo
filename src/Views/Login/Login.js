import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Login = () => {
  const [show, setShow] = useState(false);

  const login = () => {
    const url = `${process.env.REACT_APP_WSO2_URI}?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=openid`;
    window.location.replace(url);
  };

  return (
    <Flex justifyContent="center" alignItems="center" h="600px">
      <Flex
        w="70%"
        h="510px"
        border="4px solid"
        borderColor="primary.main"
        borderRadius="40px"
        flexDir="column"
      >
        <Text pt="50px" variant="body2" textAlign="center">
          Login
        </Text>
        <Flex
          mt={8}
          gap={7}
          flexDir="column"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Flex w="60%" alignItems="center" gap={2}>
            <Text>Organization</Text>
            {":"}
            <Select
              ml={4}
              w="100%"
              variant="flushed"
              boxShadow="none"
              borderColor="custom.main"
              _focusVisible={{
                borderColor: "custom.main",
                boxShadow: "none",
              }}
              _hover={{
                borderColor: "custom.main",
                boxShadow: "none",
              }}
            >
              <option>ABSA</option>
              <option>EXL</option>
            </Select>
          </Flex>
          <Input placeholder="Username" variant="flushed" w="60%" isDisabled />
          <InputGroup w="60%">
            <Input
              isDisabled
              variant="flushed"
              type={show ? "text" : "password"}
              placeholder="Password"
            />
            <InputRightElement>
              {show ? (
                <VisibilityOffOutlinedIcon
                  onClick={() => setShow(!show)}
                  style={{ color: "#455468", cursor: "pointer" }}
                />
              ) : (
                <VisibilityOutlinedIcon
                  onClick={() => setShow(!show)}
                  style={{ color: "#455468", cursor: "pointer" }}
                />
              )}
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Flex w="100%" justifyContent="center" alignItems="center" mt={4}>
          <Text variant="body5" textAlign="left" w="60%" cursor="pointer">
            Forgot Password?
          </Text>
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          mt={14}
        >
          <Box>
            <Button w="260px" onClick={login}>
              Login
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
