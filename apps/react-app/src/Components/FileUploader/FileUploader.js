import { Box, Input } from "@chakra-ui/react";
import { useEffect } from "react";

const FileUploader = (props) => {
  const onFileChange = (event) => {
    props.handleFiles(event.target.files[0]);
    event.target.value = "";
  };

  const overrideEventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragOver = (event) => {
    overrideEventDefaults(event);
  };

  const handleDragLeave = (event) => {
    overrideEventDefaults(event);
  };

  const handleDragAndDropFiles = (event) => {
    overrideEventDefaults(event);
    if (!event.dataTransfer) return;
    props.handleFiles(event.dataTransfer.files[0]);
  };

  useEffect(() => {
    const preventDefault = (event) => {
      event.preventDefault();
    };

    const handleDragEnter = (event) => {
      overrideEventDefaults(event);
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", handleDragAndDropFiles);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", handleDragAndDropFiles);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      onDrop={handleDragAndDropFiles}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Input
        type="file"
        accept="application/pdf"
        hidden
        ref={props.fileInput}
        onChange={onFileChange}
      />
    </Box>
  );
};

export default FileUploader;
