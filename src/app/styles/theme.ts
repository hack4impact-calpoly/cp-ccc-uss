import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    customGray: "#8D8C8C",
    placeholder: "#ACABAB",
    inputBorder: "#000000",
  },
  fonts: {
    body: "'Helvetica', 'Arial', sans-serif",
    heading: "'Helvetica', 'Arial', sans-serif",
    dmSans: "'DM Sans', sans-serif",
  },
  components: {
    Input: {
      variants: {},
    },
    Button: {
      variants: {},
    },
    //...other components
  },
});

export default theme;
