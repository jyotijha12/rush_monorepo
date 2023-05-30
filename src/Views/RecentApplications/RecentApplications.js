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

const data = [
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A012",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A013",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A014",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A014",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01444",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01444",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Saved",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
  {
    id: 1,
    application_number: "A01",
    instance_number: 1,
    user: "User1",
    status: "Complete",
    error_warning: "No",
    last_updated: "24th March 2023",
  },
];

const RecentApplications = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const navigate = useNavigate();

  const fetchData = () => {
    let data = new FormData();
    data.append("page_number", "1");
    data.append("page_size", "150");
    data.append("file_details", "1");

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BASE_API_URL}/get_data/`,
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // fetchData();
  }, []);

  const handleSearch = () => {
    if (search === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) => item.application_number.toLowerCase() === search.toLowerCase()
      );
      setFilteredData(filtered);
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
