import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const ApplicationExistDialog = (props) => {
  return (
    <Modal
      size="4xl"
      isOpen={props.open}
      onClose={props.onClose}
      scrollBehavior="outside"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody mt={10}>
          <Flex w="100%" alignItems="center" justifyContent="center" h="500px">
            <Flex
              gap={6}
              flexDir="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text variant="body3" textAlign="center" color="primary.main">
                This application number already exists!
              </Text>
              <Text variant="body7" textAlign="center">
                How would you like to proceed further?
              </Text>
              <Flex gap={6} mt={2}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    props.setFormData({
                      ...props.formData,
                      applicationId: "",
                    });
                    props.onClose();
                  }}
                >
                  Change the application number
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    props.setFormData({
                      ...props.formData,
                      instanceId: Number(props.formData.instanceId) + 1,
                    });
                    props.onClose();
                  }}
                >
                  Add as an Instance
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ApplicationExistDialog;
