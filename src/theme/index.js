import { extendTheme } from "@chakra-ui/react";
import components from "./components";
import foundations from "./foundations";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = {
  heading: "Poppins",
  body: "Poppins",
};

const theme = extendTheme({
  config,
  ...foundations,
  components,
  fonts,
});

export default theme;
