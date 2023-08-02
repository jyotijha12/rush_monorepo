import {
  Button,
  CircularProgress,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GenerationInsightsDialog = (props) => {
  const navigate = useNavigate();

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
        <ModalBody mt={10}>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            h="500px"
            flexDir="column"
            gap={8}
          >
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
            <Button
              leftIcon={<Home />}
              onClick={() => navigate(`${process.env.REACT_APP_HOME}`)}
            >
              Redirect to Home Page
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GenerationInsightsDialog;
