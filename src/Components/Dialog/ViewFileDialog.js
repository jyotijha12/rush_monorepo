import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import PDFViewer from "../PDFViewer/PDFViewer";

const ViewFileDialog = (props) => {
  return (
    <Modal
      size="4xl"
      isOpen={props.open}
      onClose={props.onClose}
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody mt={10}>
          <Flex w="100%" alignItems="center" justifyContent="center">
            <PDFViewer />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewFileDialog;
