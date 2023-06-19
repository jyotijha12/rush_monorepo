import {
  Box,
  Button,
  Card,
  CircularProgress,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
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
import { uploadFile } from "../../utils/S3/uploadFile";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { listFilesObject } from "../../utils/S3/listFilesObject";
import { listFiles } from "../../utils/S3/listFiles";
import { fetchErrorFile } from "../../utils/S3/fetchErrorFile";
import { axiosInstance } from "../../utils/Axios/axiosInstance";
import { getENV } from "../../utils/Encryption/getENV";
import CustomSelect from "../../Components/CustomSelect/CustomSelect";

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
  const [formData, setFormData] = useState({
    applicationId: "",
    instanceId: "1",
    type: null,
  });
  const [s3FileList, setS3FileList] = useState([]);
  const [uniqueInstanceId, setUniqueInstanceId] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();

  const location = useLocation();

  const tempTypetypes = getENV("types");
  const types = JSON.parse(tempTypetypes);

  const saveFiles = async (id) => {
    if (id) {
      await uploadFile(formData.applicationId, id, files);
      const fileList = await listFiles(`${formData.applicationId}/${id}`);
      setS3FileList(fileList);

      const filesObject = await listFilesObject(
        `${formData.applicationId}/${id}`
      );
      setFiles(filesObject);

      let data_ = {
        instance_unique_id: id,
        instance_id: formData.instanceId,
        application_id: formData.applicationId,
        input_files: files.map((item) => item.name),
        use_case_id: formData.type,
        create_new_instance: false,
      };

      let config = {
        method: "post",
        url: `/api/upload_data/`,
        data: data_,
      };
      axiosInstance
        .request(config)
        .then(async () => {
          const filesObject = await listFilesObject(
            `${formData.applicationId}/${id}`
          );
          setFiles(filesObject);

          const fileData = await fetchErrorFile(
            `${formData.applicationId}/${id}`
          );

          setErrorData(fileData ? fileData : null);
          if (fileData) {
            setLoadingSave(false);
            setSaved(true);
            toast({
              title: "Saved Request",
              description: "All files saved successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } else {
            setLoadingSave(false);
            setScanFailed(true);
            toast({
              title: "Scanning failed",
              description: "Retry save request",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .catch(() => {
          setLoadingSave(false);
          toast({
            title: "Failed",
            description: "Failed",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const getUniqueInstanceId = (params, create) => {
    let data = new FormData();
    data.append("application_id", formData.applicationId);
    data.append("instance_id", formData.instanceId);
    data.append("create_new_instance", create === "Add" ? true : false);

    let config = {
      method: "post",
      url: `/api/provide_uid/`,
      data: data,
    };
    axiosInstance
      .request(config)
      .then((response) => {
        setFormData({
          ...formData,
          instanceId: response.data.data.instance_id,
        });
        setUniqueInstanceId(response.data.data.instance_unique_id);

        if (params) {
          saveFiles(response.data.data.instance_unique_id);
        }
      })
      .catch(() => {
        setLoadingSave(false);
      });
  };

  const fileInput = useRef(null);

  const handleClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };

  useEffect(() => {
    if (location.state && location.state.rowData) {
      setSaved(true);
      setFileLoading(true);
      if (location.state.rowData.status === "Processing") {
        setGenerateInsightsDialog({ open: true, data: null });
      }
      setFormData({
        ...formData,
        applicationId: location.state.rowData.application_id,
        instanceId: location.state.rowData.instance_id,
        type: location.state.rowData.use_case_id,
      });
      setUniqueInstanceId(location.state.rowData.instance_unique_id);

      const getFiles = async () => {
        let data = new FormData();
        data.append("application_id", location.state.rowData.application_id);
        data.append("instance_id", location.state.rowData.instance_id);

        let config = {
          method: "post",
          url: `/api/get_data/`,
          data: data,
        };
        axiosInstance
          .request(config)
          .then(async (response) => {
            if (response.data.data[0].status === "Processing") {
              setGenerateInsightsDialog({ open: true, data: null });
            }

            const data = response.data.data[0];
            const filesObject = await listFilesObject(
              `${location.state.rowData.application_id}/${data.instance_unique_id}`
            );
            setFiles(filesObject);

            const fileList = await listFiles(
              `${location.state.rowData.application_id}/${data.instance_unique_id}`
            );
            setS3FileList(fileList);

            const fileData = await fetchErrorFile(
              `${location.state.rowData.application_id}/${data.instance_unique_id}`
            );
            setFileLoading(false);
            setErrorData(fileData ? fileData : null);
          })
          .catch(() => {
            setFileLoading(false);
          });
      };

      getFiles();
    }
    // eslint-disable-next-line
  }, [location.state]);

  const fetchData = (params) => {
    let data = new FormData();
    data.append("application_id", formData.applicationId.substring(0, 10));
    params && data.append("instance_id", formData.instanceId);

    let config = {
      method: "post",
      url: `/api/get_data/`,
      data: data,
    };
    axiosInstance
      .request(config)
      .then((response) => {
        if (params) {
          return response.data.data;
        } else {
          setSearchLoading(false);
          if (
            response.data.data.length > 0 &&
            response.data.data[0].application_id === formData.applicationId
          ) {
            setApplicationDialog({ open: true, data: null });
          }
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
            (existingFile) => existingFile.name === uploadedFile.name
          );

          if (fileExists) {
            while (true) {
              const newFileName = `${
                uploadedFile.name.split(".")[0]
              }_copy${copyCounter}.pdf`;
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
          setLoading(false);
        }
      }
    }
  };

  const fileSizeToMB = (size) => {
    let fileSizeInMB = size / (1024 * 1024);
    return fileSizeInMB.toFixed(2);
  };

  const removeFile = async (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  useEffect(() => {
    if (!location.state)
      if (
        formData.applicationId.length === 10 ||
        formData.applicationId.length === 16
      ) {
        setSearchLoading(true);
        fetchData();
      }
    // eslint-disable-next-line
  }, [formData.applicationId]);

  useEffect(() => {
    const getList = async () => {
      if (
        formData.applicationId.length === 10 ||
        formData.applicationId.length === 16
      ) {
        !location.state && getUniqueInstanceId(false);
        const fileList = await listFiles(
          `${formData.applicationId}/${uniqueInstanceId}`
        );
        setS3FileList(fileList);
      }
    };
    getList();
    // eslint-disable-next-line
  }, [formData.applicationId]);

  const isValid = () => {
    const newErrors = {};

    if (!formData.applicationId.trim()) {
      newErrors.applicationId = "Application number is required.";
    } else if (
      formData.applicationId.trim().length !== 10 &&
      formData.applicationId.trim().length !== 16
    ) {
      newErrors.applicationId =
        "Application number should be 10 digits or 16 digits.";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (files.length === 0) {
      newErrors.files = "Please select at least one file";
    }

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Required",
        description: Object.values(newErrors).join(", "),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    } else {
      return true;
    }
  };

  const saveRequest = async () => {
    if (isValid()) {
      setLoadingSave(true);
      getUniqueInstanceId(true);
    }
  };

  const checkStatus = () => {
    const intervalTime = 10000;
    const totalTime = 120000;
    let elapsedTime = 0;
    let pollingInterval;

    const fetchDataFunc = () => {
      let data = new FormData();
      data.append("application_id", formData.applicationId);
      data.append("instance_id", formData.instanceId);
      let config = {
        method: "post",
        url: `/api/get_data/`,
        data: data,
      };
      axiosInstance.request(config).then((response) => {
        const responseData = response.data.data[0];
        if (responseData.status === "Complete") {
          clearInterval(pollingInterval);
          setGenerateInsightsDialog({ open: false, data: null });
          navigate("tableau", { state: { rowData: responseData } });
        } else {
          elapsedTime += intervalTime;
          if (elapsedTime >= totalTime) {
            clearInterval(pollingInterval);
            if (window.location.pathname === "/absa/bti-tool") {
              toast({
                title: "Redirecting",
                description: "Redirecting to Home Screen in 5 seconds",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              setTimeout(() => navigate("/recent-applications"), 5000);
            }
          }
        }
      });
    };

    fetchDataFunc();

    pollingInterval = setInterval(fetchDataFunc, intervalTime);
  };

  const handleProcessRequest = async () => {
    if (isValid()) {
      setSaved(true);
      setGenerateInsightsDialog({ open: true, data: null });

      let data = new FormData();
      data.append("application_id", formData.applicationId);
      data.append("instance_id", formData.instanceId);
      data.append("instance_unique_id", uniqueInstanceId);

      let config = {
        method: "post",
        url: `/api/process_data/`,
        data: data,
      };
      axiosInstance
        .request(config)
        .then(() => {
          checkStatus();
        })
        .catch(() => {});
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
            <Text variant="body2">BTI Solution</Text>
            <Flex w="100%" gap={4} mt={4}>
              <Flex flexDir="column" gap={1} w="60%">
                <Flex w="100%">
                  <Text variant="body1semiBold">Application Number</Text>
                  <Text variant="body1semiBold" color="primary.main">
                    *
                  </Text>
                </Flex>
                <InputGroup>
                  <Input
                    isDisabled={
                      (location.state && location.state.rowData) ||
                      searchLoading
                    }
                    maxLength={16}
                    value={formData.applicationId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationId: e.target.value,
                      })
                    }
                  />
                  <InputRightElement>
                    {searchLoading && (
                      <CircularProgress
                        isIndeterminate
                        color="custom.main"
                        size="20px"
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
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
                  <CustomSelect
                    types={types}
                    formData={formData}
                    setFormData={setFormData}
                    setSaved={setSaved}
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
                  borderColor={"primary.main"}
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
                      onClick={() => {
                        setSaved(false);
                        formData.applicationId !== "" &&
                          setUploaderDialog({ open: true, data: null });
                      }}
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
                      {fileLoading ? (
                        <Flex gap={4} alignItems="center">
                          <CircularProgress
                            isIndeterminate
                            color="#1FAF10"
                            thickness="8px"
                            size="40px"
                          />
                          <Text variant="body6">Fetching files</Text>
                        </Flex>
                      ) : loading ? (
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
                                {errorData &&
                                errorData.hasOwnProperty(file.name) ? (
                                  errorData[file.name] &&
                                  errorData[file.name] === "success" ? (
                                    <CheckCircleRoundedIcon
                                      style={{ color: "#1FAF10" }}
                                    />
                                  ) : (
                                    <RemoveCircleRoundedIcon
                                      style={{ color: "#BF0026" }}
                                    />
                                  )
                                ) : (
                                  <CheckCircleRoundedIcon
                                    style={{ color: "#1FAF10" }}
                                  />
                                )}
                                {errorData &&
                                errorData.hasOwnProperty(file.name) &&
                                errorData[file.name] === null ? (
                                  <Text variant="body6">{`${
                                    file.name
                                  } ] ${fileSizeToMB(file.size)} MB`}</Text>
                                ) : errorData &&
                                  errorData[file.name] &&
                                  errorData[file.name] === "error" ? (
                                  <Text variant="body6" color="primary.main">
                                    {`${file.name} file failed in scanning`}
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
                                {loadingSave ? (
                                  <Flex>
                                    <Text>Scanning...</Text>
                                  </Flex>
                                ) : !errorData && scanFailed ? (
                                  <Flex>
                                    <Text>
                                      Scanning failed retry, save request
                                    </Text>
                                  </Flex>
                                ) : (
                                  <>
                                    <Flex
                                      cursor="pointer"
                                      gap={2}
                                      justifyContent="space-between"
                                      alignItems="center"
                                      onClick={() => {
                                        setSaved(false);
                                        removeFile(i);
                                      }}
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
                                        s3FileList.includes(file.name) &&
                                        errorData &&
                                        errorData[file.name] !== "error"
                                          ? setViewFileDialog({
                                              open: true,
                                              data: file,
                                            })
                                          : ""
                                      }
                                      cursor={
                                        s3FileList.includes(file.name) &&
                                        errorData &&
                                        errorData[file.name] !== "error"
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
                                            s3FileList.includes(file.name) &&
                                            errorData &&
                                            errorData[file.name] !== "error"
                                              ? "#BF0026"
                                              : "gray",
                                          fontSize: "20px",
                                        }}
                                      />
                                      <Text
                                        variant="subtitle1"
                                        color={
                                          s3FileList.includes(file.name) &&
                                          errorData &&
                                          errorData[file.name] !== "error"
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
            <Button
              mr={4}
              w="25%"
              cursor={!loadingSave && saved ? "no-drop" : "pointer"}
              onClick={() => {
                if (!loadingSave && !saved) saveRequest();
              }}
              rightIcon={
                loadingSave && (
                  <CircularProgress
                    isIndeterminate
                    color="primary.main"
                    size="24px"
                  />
                )
              }
            >
              Save Request
            </Button>
            <Button
              cursor={
                saved &&
                errorData &&
                !Object.values(errorData).includes("error")
                  ? "pointer"
                  : "no-drop"
              }
              w="25%"
              onClick={() => {
                if (saved && !Object.values(errorData).includes("error"))
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
        getUniqueInstanceId={getUniqueInstanceId}
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
