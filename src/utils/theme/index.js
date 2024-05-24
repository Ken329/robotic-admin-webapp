import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = {
  body: "Segoe UI, sans-serif",
  heading: "Segoe UI, sans-serif",
  mono: "Segoe UI, monospace",
};

const theme = extendTheme({
  config,
  fonts,
});

export default theme;
