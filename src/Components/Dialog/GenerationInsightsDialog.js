import {
  CircularProgress,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const GenerationInsightsDialog = (props) => {
  return (
    <Modal
      size="4xl"
      isOpen={props.open}
      onClose={props.onClose}
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody mt={10}>
          <Flex w="100%" alignItems="center" justifyContent="center" h="500px">
            <Flex
              gap={6}
              flexDir="column"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress
                isIndeterminate
                color="#1FAF10"
                thickness="8px"
                size="110px"
              />
              <Text variant="body1" textAlign="center">
                Generating Insights
              </Text>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GenerationInsightsDialog;
