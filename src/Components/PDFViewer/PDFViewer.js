import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function PDFViewer(props) {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result);
    };
    reader.readAsDataURL(props.data);
    return () => {
      URL.revokeObjectURL(fileUrl);
    };

    // eslint-disable-next-line
  }, [props.data]);

  if (!fileUrl) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box width="100%" height="100%" overflow="hidden">
      <object
        style={{ border: "white", borderRadius: "10px" }}
        data={`${fileUrl}#toolbar=0&navpanes=0`}
        type="application/pdf"
        width="100%"
        height="100%"
      >
        <Text>
          It appears you don't have a PDF plugin for this browser. You can
          <a href={fileUrl}>click here to download the PDF file</a>.
        </Text>
      </object>
    </Box>
  );
}

export default PDFViewer;
