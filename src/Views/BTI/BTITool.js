import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Flex,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { Add } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import UploaderDialog from "../../Components/Dialog/UploaderDialog";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ViewFileDialog from "../../Components/Dialog/ViewFileDialog";
import GenerationInsightsDialog from "../../Components/Dialog/GenerationInsightsDialog";
import { useNavigate } from "react-router-dom";

const BTITool = () => {
  const [uploaderDialog, setUploaderDialog] = useState({
    open: false,
    data: null,
  });
  const [viewFileDialog, setViewFileDialog] = useState({
    open: false,
    data: null,
  });
  const [generateInsightsDialog, setGenerateInsightsDialog] = useState({
    open: false,
    data: null,
  });
  const [files, setFiles] = useState([{ name: "adsdas" }, { name: "ssdsdsd" }]);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);

  const navigate = useNavigate();

  const types = [
    "Consumer (Salaried-Full Time Employed)",
    "Pensioner",
    "Temporary Employed",
    "Student",
    "Self Employed Professional",
    "Self Employed Non-Professional",
    "Solo Proprietors",
  ];

  useEffect(() => {
    console.log(files[0]);
  }, [files]);

  const fileInput = useRef(null);

  const handleClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFiles = (fileList) => {
    if (fileList.length > 0) {
      setFiles(fileList);
      setUploaderDialog({ open: false, data: null });
    }
  };

  return (
    <>
      <Box mb={4}>
        <Flex
          justifyContent="center"
          alignItems="center"
          h="100%"
          pt={8}
          pb={6}
        >
          <Flex
            w="70%"
            h="100%"
            border="4px solid"
            borderColor="primary.main"
            borderRadius="40px"
            flexDir="column"
            p={10}
          >
            <Text variant="body2">BTI Tool</Text>
            <Flex w="100%" gap={4} mt={4}>
              <Flex flexDir="column" gap={1} w="60%">
                <Flex w="100%">
                  <Text variant="body1semiBold">Application Number</Text>
                  <Text variant="body1semiBold" color="primary.main">
                    *
                  </Text>
                </Flex>
                <Input />
              </Flex>
              <Flex flexDir="column" gap={1} w="40%">
                <Text variant="body1semiBold">Instance</Text>
                <Input />
              </Flex>
            </Flex>
            <Flex w="100%" mt={4}>
              <Flex w="59%" gap={4}>
                <Flex flexDir="column" gap={1} w="100%">
                  <Text variant="body1semiBold">Type</Text>
                  <Select
                    placeholder="Select the type of application"
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
                    {types.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </Flex>
              </Flex>
            </Flex>
            <Text mt={6} variant="body1">
              Upload Bank Statements
            </Text>
            <Flex mt={4}>
              <Card w="100%">
                <Flex
                  borderLeft="5px solid"
                  borderColor={upload ? "success.main" : "primary.main"}
                  borderRadius="4px"
                >
                  <Flex
                    p={6}
                    px={8}
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex flexDir="column">
                      <Text variant="body1">Bank Statements</Text>
                      <Text variant="subtitle1">
                        Supported file format are .pdf and expected size &lt;8MB
                      </Text>
                    </Flex>
                    {upload ? (
                      <Flex justifyContent="center" alignItems="center">
                        <CheckCircleRoundedIcon style={{ color: "#1FAF10" }} />
                      </Flex>
                    ) : (
                      <Flex
                        cursor="pointer"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center"
                        onClick={() =>
                          setUploaderDialog({ open: true, data: null })
                        }
                      >
                        <Add style={{ color: "#455468" }} />
                        <Text variant="subtitle1">Add files</Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
                {files.length > 0 && (
                  <Flex
                    p={6}
                    px={8}
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex flexDir="column" w="100%" h="100%" gap={6}>
                      {loading ? (
                        <Flex gap={4} alignItems="center">
                          <CircularProgress
                            isIndeterminate
                            color="#1FAF10"
                            thickness="8px"
                            size="40px"
                          />
                          <Text variant="body6">Uploading files</Text>
                        </Flex>
                      ) : (
                        files.map((file, i) => {
                          return (
                            <Flex
                              key={i}
                              justifyContent="space-between"
                              alignItems="center"
                              w="100%"
                            >
                              <Flex alignItems="center" gap={4}>
                                <CheckCircleRoundedIcon
                                  style={{ color: "#1FAF10" }}
                                />
                                <Text variant="body6">{file.name}</Text>
                              </Flex>
                              <Flex gap={6}>
                                <Flex
                                  cursor="pointer"
                                  gap={2}
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <DeleteOutlineRoundedIcon
                                    style={{
                                      color: "#455468",
                                      fontSize: "20px",
                                    }}
                                  />
                                  <Text variant="subtitle1">Remove</Text>
                                </Flex>
                                <Flex
                                  onClick={() =>
                                    setViewFileDialog({
                                      open: true,
                                      data: null,
                                    })
                                  }
                                  cursor="pointer"
                                  gap={2}
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      color: "#BF0026",
                                      fontSize: "20px",
                                    }}
                                  />
                                  <Text
                                    variant="subtitle1"
                                    color="primary.main"
                                  >
                                    View
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          );
                        })
                      )}
                      <Divider />
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text variant="subtitle1">
                          Only upload your files once you have added all the
                          files needed for this section
                        </Text>
                        <Button
                          w="20%"
                          variant="secondary2"
                          onClick={() => {
                            setUpload(true);
                            setFiles([]);
                          }}
                        >
                          Upload Files
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                )}
              </Card>
            </Flex>
          </Flex>
        </Flex>
        <Flex justifyContent="center" alignItems="center" mt="0">
          <Flex w="70%" justifyContent="flex-end">
            <Button mr={4} w="25%">
              Save Request
            </Button>
            <Button
              w="25%"
              onClick={() => {
                setGenerateInsightsDialog({ open: true, data: null });
                setTimeout(() => {
                  setGenerateInsightsDialog({ open: false, data: null });
                  navigate("tableau");
                }, 3000);
              }}
            >
              Process Request
            </Button>
          </Flex>
        </Flex>
      </Box>
      <UploaderDialog
        open={uploaderDialog.open}
        data={uploaderDialog.data}
        handleClick={handleClick}
        handleFiles={handleFiles}
        fileInput={fileInput}
        onClose={() => setUploaderDialog({ open: false, data: null })}
      />
      <ViewFileDialog
        open={viewFileDialog.open}
        data={viewFileDialog.data}
        onClose={() => setViewFileDialog({ open: false, data: null })}
      />
      <GenerationInsightsDialog
        open={generateInsightsDialog.open}
        data={generateInsightsDialog.data}
        onClose={() => setGenerateInsightsDialog({ open: false, data: null })}
      />
    </>
  );
};

export default BTITool;
