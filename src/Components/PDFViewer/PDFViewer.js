import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import file from "../../Resources/READ-ME.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (delta) => {
    setCurrentPage((prevPage) => prevPage + delta);
  };
  return (
    <Box>
      <Box
        // position="relative"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          renderMode="canvas"
        >
          <Page pageNumber={currentPage} />
        </Document>
        <div>
          <button disabled={currentPage <= 1} onClick={() => changePage(-1)}>
            Previous
          </button>
          <span>
            Page {currentPage} of {numPages}
          </span>
          <button
            disabled={currentPage >= numPages}
            onClick={() => changePage(1)}
          >
            Next
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default PDFViewer;
