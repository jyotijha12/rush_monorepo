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
  const data = props.data ? props.data : [];

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
              {data.filter((item) => item.status === "Saved").length === 0 ? (
                <Text variant="body3" textAlign="center" color="primary.main">
                  This application number already exists!
                </Text>
              ) : (
                <Text variant="body3" textAlign="center" color="primary.main">
                  This application number is already saved!
                </Text>
              )}

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
                      instanceId: "1",
                    });
                    props.onClose();
                  }}
                >
                  Change the application number
                </Button>
                {data.filter((item) => item.status === "Saved").length === 0 ? (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await props.getUniqueInstanceId(false, "Add");
                      props.onClose();
                    }}
                  >
                    Add as an Instance
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      const temp = data.filter(
                        (item) => item.status === "Saved"
                      );
                      await props.redirectSave(temp[0]);
                      props.onClose();
                    }}
                  >
                    Redirect to saved request
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ApplicationExistDialog;
