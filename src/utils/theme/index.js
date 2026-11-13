import { extendTheme } from '@chakra-ui/react';

import styles from '@utils/theme/views';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const fonts = {
  body: "'Inter', sans-serif",
  heading: "'Inter', sans-serif",
  mono: "'Inter', monospace"
};

const globalStyles = {
  global: {
    'html, body': {
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0
    },
    '#root': {
      height: '100%'
    },
    ...styles.global
  }
};

const theme = extendTheme({
  config,
  fonts,
  styles: globalStyles
});

export default theme;
