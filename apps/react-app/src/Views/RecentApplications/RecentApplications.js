import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationTable from "../../Components/Table/ApplicationTable";
import { axiosInstance } from "../../utils/Axios/axiosInstance";

const RecentApplications = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const alphanumericRegex = /^[a-zA-Z0-9]*$/;
  const toast = useToast();

  const navigate = useNavigate();

  const fetchData = (application_pattern) => {
    let data = new FormData();
    application_pattern &&
      data.append("application_pattern", application_pattern);
    data.append("page_number", "1");
    data.append("page_size", "100");
    data.append("file_details", "1");

    let config = {
      method: "post",
      url: `/api/get_data/`,
      data: data,
    };
    axiosInstance
      .request(config)
      .then((response) => {
        setFilteredData(response.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();

    let intervalId;

    if (search === "") {
      intervalId = setInterval(() => {
        if (
          window.location.pathname ===
          `${process.env.REACT_APP_BASENAME}${process.env.REACT_APP_HOME}`
        ) {
          fetchData();
        }
      }, 5000);
    }

    return () => {
      clearInterval(intervalId);
    };

    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    if (search === "") fetchData();
  }, [search]);

  const handleSearch = () => {
    if (alphanumericRegex.test(search)) {
      if (search === "") {
        setFilteredData(filteredData);
      } else {
        fetchData(search);
      }
    } else {
      toast({
        title: "Invalid search",
        description: "Search accepts only alphanumeric characters.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const heading = [
    "Application Number",
    "Instance Number",
    "User",
    "Status",
    "Error/Warning",
    "Action",
    "Last Updated (SAST)",
  ];

  return (
    <Box mb={4}>
      <Flex justifyContent="center" alignItems="center" h="100%" pt={8} pb={6}>
        <Flex
          w="85%"
          h="100%"
          border="4px solid"
          borderColor="primary.main"
          borderRadius="40px"
          flexDir="column"
          p={14}
        >
          <Box>
            <Button
              w="40%"
              onClick={() => navigate(`${process.env.REACT_APP_BTI_SOLUTION}`)}
            >
              Add New Application
            </Button>
          </Box>
        </Flex>
      </Flex>
      <Flex justifyContent="center">
        <Flex w="75%" flexDir="column" gap={4}>
          <Text variant="body2">Recent Applications</Text>
          <Flex gap={4}>
            <Flex flexDir="column" gap={1} w="55%">
              <Text variant="body1semiBold">Search</Text>
              <Flex gap={4}>
                <InputGroup>
                  <InputRightElement pointerEvents="none">
                    <SearchRoundedIcon color="custom.main" />
                  </InputRightElement>
                  <Input
                    placeholder="Search for application number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  />
                </InputGroup>
                <Button
                  _disabled={{
                    bg: "#D9D9D9",
                    _hover: { bg: "#D9D9D9", cursor: "no-drop" },
                  }}
                  isDisabled={search === ""}
                  w="50%"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Box mt={4}>
            <ApplicationTable heading={heading} data={filteredData} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RecentApplications;
