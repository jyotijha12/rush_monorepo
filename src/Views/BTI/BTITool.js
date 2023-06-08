import {
  Box,
  Button,
  Card,
  CircularProgress,
  Flex,
  Input,
  Text,
  useToast,
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
import ApplicationExistDialog from "../../Components/Dialog/ApplicationExistDialog";
import Select from "react-select";
import { uploadFile } from "../../utils/S3/uploadFile";
import { checkFile } from "../../utils/S3/checkFileInS3";
import { deleteFile } from "../../utils/S3/deleteFile";
import { checkFileExist } from "../../utils/S3/checkFileExist";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

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
  const [applicationDialog, setApplicationDialog] = useState({
    open: false,
    data: null,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: "",
    instanceId: "1",
    type: "",
  });
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const toast = useToast();

  const types = [
    "Consumer (Salaried-Full Time Employed)",
    "Pensioner",
    "Temporary Employed",
    "Student",
    "Self Employed Professional",
    "Self Employed Non-Professional",
    "Solo Proprietors",
  ];

  const fileInput = useRef(null);

  const handleClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFiles = async (file) => {
    setLoading(true);
    if (file) {
      if (file.name.split(".").pop() !== "pdf") {
        toast({
          title: "Error",
          description: "File is not in pdf format!!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        if (fileSizeToMB(file.size) > 8.0) {
          toast({
            title: "Error",
            description: "File size is greater than 8 MB",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          const uploadedFile = file;
          let renamedFile = uploadedFile;
          let copyCounter = 1;

          const fileExists = files.find(
            (file) => file.name === uploadedFile.name
          );

          setFiles((prevFiles) => [...prevFiles, renamedFile]);
          setUploaderDialog({ open: false, data: null });

          if (fileExists) {
            while (true) {
              const newFileName = `${uploadedFile.name}_copy${copyCounter}`;
              const existingFile = files.find(
                (file) => file.name === newFileName
              );

              if (!existingFile) {
                renamedFile = new File([uploadedFile], newFileName);
                break;
              }

              copyCounter++;
            }
          }

          await uploadFile(
            formData.applicationId,
            formData.instanceId,
            renamedFile
          );

          setLoading(false);
        }
      }
    }
  };

  useEffect(() => console.log("data-------", data), [data]);

  useEffect(() => {
    const interval = setInterval(async () => {
      let stopPolling = true;

      for (const file of files) {
        await delay(5000);

        const maxRetries = 5;
        let retries = 0;
        let fileData = null;

        while (retries < maxRetries && !fileData) {
          fileData = await checkFile(
            formData.applicationId,
            formData.instanceId,
            file.name.split(".")[0]
          );
          retries++;
        }

        if (!fileData) {
          stopPolling = false;
        }

        setData((prevData) => ({ ...prevData, [file.name]: fileData }));
      }

      if (stopPolling) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [files, formData]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fileSizeToMB = (size) => {
    let fileSizeInMB = size / (1024 * 1024);
    return fileSizeInMB.toFixed(2);
  };

  const removeFile = async (index) => {
    const fileToRemove = files[index];

    try {
      await deleteFile(
        formData.applicationId,
        formData.instanceId,
        fileToRemove.name.split(".")[0]
      );
    } catch (error) {
      console.error("Error deleting file from S3:", error);
    }

    const jsonFileName = `${fileToRemove.name.split(".")[0]}.json`;
    const jsonFileExists = await checkFileExist(
      formData.applicationId,
      formData.instanceId,
      jsonFileName
    );

    if (jsonFileExists) {
      try {
        await deleteFile(
          formData.applicationId,
          formData.instanceId,
          jsonFileName
        );
      } catch (error) {
        console.error("Error deleting JSON file from S3:", error);
      }
    }

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleApplicationNumberInput = () => {
    // if application number already present
    setApplicationDialog({ open: true, data: null });
  };

  useEffect(() => {
    if (formData.applicationId.length === 10) {
      handleApplicationNumberInput();
    }
  }, [formData.applicationId]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid #455468" : "1px solid #455468",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        border: state.isFocused ? "1px solid #455468" : "1px solid #455468",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgba(191, 0, 38, 0.15)" : null,
      color: "black",
      "&:hover": {
        backgroundColor: state.isSelected
          ? "rgba(191, 0, 38, 0.05)"
          : "rgba(191, 0, 38, 0.05)",
      },
    }),
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
                <Input
                  value={formData.applicationId}
                  onChange={(e) =>
                    setFormData({ ...formData, applicationId: e.target.value })
                  }
                />
              </Flex>
              <Flex flexDir="column" gap={1} w="40%">
                <Text variant="body1semiBold">Instance</Text>
                <Input value={formData.instanceId} isDisabled />
              </Flex>
            </Flex>
            <Flex w="100%" mt={4}>
              <Flex w="59%" gap={4}>
                <Flex flexDir="column" gap={1} w="100%">
                  <Text variant="body1semiBold">Type</Text>
                  <Select
                    placeholder="Select the type of application"
                    styles={customStyles}
                    isClearable
                    onChange={(e) => {
                      if (e) {
                        setFormData({
                          ...formData,
                          type: e.value,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          type: "",
                        });
                      }
                    }}
                    options={types.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
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
                        Supported file format are .pdf and expected size &lt;
                        8MB
                      </Text>
                    </Flex>
                    {upload ? (
                      <Flex justifyContent="center" alignItems="center">
                        <CheckCircleRoundedIcon style={{ color: "#1FAF10" }} />
                      </Flex>
                    ) : (
                      <Flex
                        cursor={
                          formData.applicationId !== "" ? "pointer" : "no-drop"
                        }
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center"
                        onClick={() =>
                          formData.applicationId !== "" &&
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
                                {data.hasOwnProperty(file.name) &&
                                data[file.name] &&
                                data[file.name].data === "Success" ? (
                                  <CheckCircleRoundedIcon
                                    style={{ color: "#1FAF10" }}
                                  />
                                ) : (
                                  <RemoveCircleRoundedIcon
                                    style={{ color: "#BF0026" }}
                                  />
                                )}
                                {data.hasOwnProperty(file.name) &&
                                data[file.name] &&
                                data[file.name].data === "Success" ? (
                                  <Text variant="body6">{`${
                                    file.name
                                  } ] ${fileSizeToMB(file.size)} MB`}</Text>
                                ) : (
                                  <Text
                                    variant="body6"
                                    color="primary.main"
                                  >{`${file.name} has errors`}</Text>
                                )}
                              </Flex>
                              <Flex gap={6}>
                                <Flex
                                  cursor="pointer"
                                  gap={2}
                                  justifyContent="space-between"
                                  alignItems="center"
                                  onClick={() => removeFile(i)}
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
                                  cursor={
                                    data.hasOwnProperty(file.name) &&
                                    data[file.name] &&
                                    data[file.name].data === "Success"
                                      ? "pointer"
                                      : "no-drop"
                                  }
                                  gap={2}
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      color:
                                        data.hasOwnProperty(file.name) &&
                                        data[file.name] &&
                                        data[file.name].data === "Success"
                                          ? "#BF0026"
                                          : "gray",
                                      fontSize: "20px",
                                    }}
                                  />
                                  <Text
                                    variant="subtitle1"
                                    color={
                                      data.hasOwnProperty(file.name) &&
                                      data[file.name] &&
                                      data[file.name].data === "Success"
                                        ? "primary.main"
                                        : "gray"
                                    }
                                  >
                                    View
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          );
                        })
                      )}
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
      <ApplicationExistDialog
        open={applicationDialog.open}
        data={applicationDialog.data}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setApplicationDialog({ open: false, data: null })}
      />
    </>
  );
};

export default BTITool;
