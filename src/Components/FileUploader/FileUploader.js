import { Box, Input } from "@chakra-ui/react";

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
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragAndDropFiles = (event) => {
    overrideEventDefaults(event);
    if (!event.dataTransfer) return;
    props.handleFiles(event.dataTransfer.files[0]);
  };

  return (
    <Box
      onDrop={handleDragAndDropFiles}
      onDragEnter={overrideEventDefaults}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
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
