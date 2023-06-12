import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationTable from "../../Components/Table/ApplicationTable";

const RecentApplications = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  const fetchData = (application_id) => {
    const token = JSON.parse(localStorage.getItem("token"))["data"];
    let data = new FormData();
    application_id && data.append("application_id", application_id);
    data.append("page_number", "1");
    data.append("page_size", "100");
    data.append("file_details", "1");

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BASE_API_URL}/api/get_data/`,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        setFilteredData(response.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search === "") fetchData();
  }, [search]);

  const handleSearch = () => {
    if (search === "") {
      setFilteredData(filteredData);
    } else {
      fetchData(search);
    }
  };

  const heading = [
    "Application Number",
    "Instance Number",
    "User",
    "Status",
    "Error/Warning",
    "Action",
    "Last Updated",
  ];

  return (
    <Box mb={4}>
      <Flex justifyContent="center" alignItems="center" h="100%" pt={8} pb={6}>
        <Flex
          w="80%"
          h="100%"
          border="4px solid"
          borderColor="primary.main"
          borderRadius="40px"
          flexDir="column"
          p={14}
        >
          <Box>
            <Button w="40%" onClick={() => navigate("/bti-tool")}>
              Add New Application
            </Button>
          </Box>
        </Flex>
      </Flex>
      <Flex justifyContent="center">
        <Flex w="70%" flexDir="column" gap={4}>
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
                  />
                </InputGroup>
                <Button variant="secondary" w="50%" onClick={handleSearch}>
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
