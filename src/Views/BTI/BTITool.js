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
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationExistDialog from "../../Components/Dialog/ApplicationExistDialog";
import Select from "react-select";
import { uploadFile } from "../../utils/S3/uploadFile";
import { checkFile } from "../../utils/S3/checkFileInS3";
import { deleteFile } from "../../utils/S3/deleteFile";
import { checkFileExist } from "../../utils/S3/checkFileExist";
import { copyFiles } from "../../utils/S3/copyFiles";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import axios from "axios";

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

  const location = useLocation();

  const types = [
    "Consumer (Salaried-Full Time Employed)",
    "Pensioner",
    "Temporary Employed",
    "Student",
    "Self Employed Professional",
    "Self Employed Non-Professional",
    "Solo Proprietors",
  ];

  const type_s = [
    { label: "Consumer (Salaried-Full Time Employed)", value: "1" },
    { label: "Pensioner", value: "1" },
    { label: "Temporary Employed", value: "1" },
    { label: "Student", value: "1" },
    { label: "Self Employed Professional", value: "1" },
    { label: "Self Employed Non-Professional", value: "1" },
    { label: "Solo Proprietors", value: "1" },
  ];

  const fileInput = useRef(null);

  const handleClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };

  useEffect(() => {
    if (location.state && location.state.rowData) {
      setFormData({
        ...formData,
        applicationId: location.state.rowData.application_id,
        instanceId: location.state.rowData.instance_id,
        // type: rowData.type,
      });
    }

    // eslint-disable-next-line
  }, [location.state]);

  const fetchData = () => {
    const token = JSON.parse(localStorage.getItem("token"))["data"];
    let data = new FormData();
    data.append("application_id", formData.applicationId.substring(0, 10));
    data.append("instance_id", formData.instanceId);

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
        if (response.data.data.length > 0) {
          setFormData({
            ...formData,
            instanceId: response.data.data[0].instance_id,
          });
          setApplicationDialog({ open: true, data: null });
        }
      })
      .catch(() => {});
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
        if (fileSizeToMB(file.size) > 25.0) {
          toast({
            title: "Error",
            description: "File size is greater than 25 MB",
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

          if (fileExists) {
            while (true) {
              const newFileName = `${
                uploadedFile.name.split(".")[0]
              }_copy${copyCounter}`;
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

          setFiles((prevFiles) => [...prevFiles, renamedFile]);
          setUploaderDialog({ open: false, data: null });

          // await uploadFile(
          //   formData.applicationId,
          //   formData.instanceId,
          //   renamedFile
          // );

          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    let pollingInterval;

    const startPolling = async () => {
      let pollingTime = 0;

      pollingInterval = setInterval(async () => {
        let stopPolling = true;

        for (const file of files) {
          const fileName = file.name;
          const fileData = await checkFile(
            formData.applicationId,
            formData.instanceId,
            fileName.split(".")[0]
          );

          if (fileData) {
            stopPolling = false;
          }

          setData((prevData) => ({ ...prevData, [fileName]: fileData }));
        }

        if (stopPolling || pollingTime >= 10) {
          clearInterval(pollingInterval);
        }

        pollingTime += 3;
      }, 3000);
    };

    startPolling();

    return () => clearInterval(pollingInterval);
  }, [files, formData]);

  const fileSizeToMB = (size) => {
    let fileSizeInMB = size / (1024 * 1024);
    return fileSizeInMB.toFixed(2);
  };

  const removeFile = async (index) => {
    // const fileToRemove = files[index];

    // try {
    //   await deleteFile(
    //     formData.applicationId,
    //     formData.instanceId,
    //     fileToRemove.name.split(".")[0]
    //   );
    // } catch (e) {}

    // const jsonFileName = `${fileToRemove.name.split(".")[0]}.json`;
    // const jsonFileExists = await checkFileExist(
    //   formData.applicationId,
    //   formData.instanceId,
    //   jsonFileName
    // );

    // if (jsonFileExists) {
    //   try {
    //     await deleteFile(
    //       formData.applicationId,
    //       formData.instanceId,
    //       jsonFileName
    //     );
    //   } catch (error) {}
    // }

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  useEffect(() => {
    if (
      location.state &&
      !location.state.rowData &&
      formData.applicationId.length === 10
    ) {
      fetchData();
    }
    // eslint-disable-next-line
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

  const saveRequest = () => {
    if (
      copyFiles(
        `${formData.applicationId}/${formData.instanceId}`,
        `${formData.applicationId}/${formData.instanceId}`
      )
    ) {
      const token = JSON.parse(localStorage.getItem("token"))["data"];
      let data_ = JSON.stringify({
        instance_id: formData.instanceId,
        application_id: formData.applicationId,
        input_files: Object.keys(data).length > 0 ? Object.keys(data) : [],
        type: formData.type,
      });

      let config = {
        method: "post",
        url: `${process.env.REACT_APP_BASE_API_URL}/api/upload_data/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
        data: data_,
      };

      axios
        .request(config)
        .then(() => {
          setUpload(true);
        })
        .catch(() => {});
      toast({
        title: "Saved Request",
        description: "All files saved successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleProcessRequest = () => {
    setGenerateInsightsDialog({ open: true, data: null });
    const token = JSON.parse(localStorage.getItem("token"))["data"];

    const FormData = require("form-data");
    let data = new FormData();
    data.append("application_id", formData.applicationId);
    data.append("instance_id", formData.instanceId);

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BASE_API_URL}/api/process_data/`,
      headers: { Authorization: `Bearer ${token.access_token}` },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setGenerateInsightsDialog({ open: false, data: null });
        navigate("tableau");
      })
      .catch(() => {
        setGenerateInsightsDialog({ open: false, data: null });
      });
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
                  isDisabled={location.state && location.state.rowData}
                  maxLength={10}
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
                    isDisabled={location.state && location.state.rowData}
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
                        25MB
                      </Text>
                    </Flex>
                    <Flex
                      cursor={
                        formData.applicationId !== "" && !loading
                          ? "pointer"
                          : "no-drop"
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
                                data[file.name] === null ? (
                                  <Text variant="body6">{`${
                                    file.name
                                  } ] ${fileSizeToMB(file.size)} MB`}</Text>
                                ) : data[file.name] &&
                                  data[file.name].data === "Error" ? (
                                  <Text variant="body6" color="primary.main">
                                    {`${file.name} has errors`}
                                  </Text>
                                ) : (
                                  <Text variant="body6">
                                    {`${file.name} ] ${fileSizeToMB(
                                      file.size
                                    )} MB`}
                                  </Text>
                                )}
                              </Flex>
                              <Flex gap={6}>
                                {data.hasOwnProperty(file.name) &&
                                data[file.name] === null ? (
                                  <Text>Scanning...</Text>
                                ) : (
                                  <>
                                    {!upload && (
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
                                    )}
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
                                  </>
                                )}
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
            <Button mr={4} w="25%" onClick={saveRequest}>
              Save Request
            </Button>
            <Button
              w="25%"
              onClick={() => {
                handleProcessRequest();
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
