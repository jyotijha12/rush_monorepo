import {
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import UploadFolder from "../../Resources/UploadFolder.svg";
import UploadFile from "../../Resources/UploadFile.svg";
import FileUploader from "../FileUploader/FileUploader";

const UploaderDialog = (props) => {
  return (
    <Modal size="4xl" isOpen={props.open} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody mt={10}>
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Flex
              cursor="pointer"
              onClick={props.handleClick}
              w="100%"
              justifyContent="center"
              flexDir="column"
              alignItems="center"
              gap={4}
              py={6}
            >
              <Flex bg="primary.main" p={1} borderRadius="6px" w="60%">
                <Text textAlign="center" variant="body5" color="white" w="100%">
                  Drag & drop files for procecessing
                </Text>
              </Flex>
              <Flex justifyContent="center" alignItems="center">
                <Image pr={10} src={UploadFolder} />
              </Flex>
              <Flex justifyContent="center" alignItems="center">
                <Text variant="body1" color="primary.main" pr={6}>
                  OR
                </Text>
              </Flex>
              <Flex mt={2} justifyContent="center" alignItems="center">
                <Image src={UploadFile} />
              </Flex>
              <Flex
                gap={0}
                flexDir="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text variant="body1">Upload File</Text>
                <Text variant="body5">Supported file formats are .pdf</Text>
              </Flex>
            </Flex>
            <FileUploader
              fileInput={props.fileInput}
              handleFiles={props.handleFiles}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploaderDialog;
