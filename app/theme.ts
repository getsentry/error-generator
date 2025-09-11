import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { Theme } from '@emotion/react';
import '@fontsource/rubik';

export const lightTheme: Theme = {
  colors: {
    surface500: '#FFFFFF',
    surface400: '#F7F6FB',
    surface300: '#F1EEF9',
    surface200: '#EAE7F6',
    surface100: '#DFDBEF',
    gray100: 'rgba(112, 124, 137, 0.05)',
    gray200: 'rgba(112, 124, 137, 0.09)',
    gray300: '#707C89',
    gray400: '#57606B',
    gray500: '#181423',
    purple100: 'rgba(132, 102, 255, 0.05)',
    purple200: 'rgba(132, 102, 255, 0.09)',
    purple300: '#8466FF',
    purple400: '#6C02FF',
    blue100: 'rgba(132, 102, 255, 0.05)',
    blue200: 'rgba(132, 102, 255, 0.09)',
    blue300: '#8466FF',
    blue400: '#6C02FF',
    green100: 'rgba(6, 172, 61, 0.04)',
    green200: 'rgba(6, 172, 61, 0.07)',
    green300: '#06AC3D',
    green400: '#06892F',
    yellow100: 'rgba(243, 176, 27, 0.07)',
    yellow200: 'rgba(243, 176, 27, 0.17)',
    yellow300: '#F3B01B',
    yellow400: '#E66000',
    red100: 'rgba(255, 0, 43, 0.04)',
    red200: 'rgba(255, 0, 43, 0.08)',
    red300: '#FF002B',
    red400: '#CB0020',
    pink100: 'rgba(255, 78, 179, 0.06)',
    pink200: 'rgba(255, 78, 179, 0.12)',
    pink300: '#FF4EB3',
    pink400: '#D5008D',
  },
};

export const darkTheme: Theme = {
  colors: {
    surface500: '#272433',
    surface400: '#231E2F',
    surface300: '#191621',
    surface200: '#0D071A',
    surface100: '#000000',
    gray100: 'rgba(110, 110, 119, 0.20)',
    gray200: 'rgba(110, 110, 119, 0.28)',
    gray300: 'rgba(110, 110, 119, 0.38)',
    gray400: '#6F6F78',
    gray500: '#A39EB3',
    purple100: 'rgba(137, 112, 255, 0.14)',
    purple200: 'rgba(137, 112, 255, 0.20)',
    purple300: '#8970FF',
    purple400: '#9B8DFF',
    blue100: 'rgba(137, 112, 255, 0.14)',
    blue200: 'rgba(137, 112, 255, 0.20)',
    blue300: '#8970FF',
    blue400: '#9B8DFF',
    green100: 'rgba(9, 179, 64, 0.20)',
    green200: 'rgba(9, 179, 64, 0.26)',
    green300: '#09B340',
    green400: '#0CC848',
    yellow100: 'rgba(247, 179, 28, 0.09)',
    yellow200: 'rgba(247, 179, 28, 0.13)',
    yellow300: '#F7B31C',
    yellow400: '#FDCF20',
    red100: 'rgba(255, 51, 60, 0.16)',
    red200: 'rgba(255, 51, 60, 0.20)',
    red300: '#FF333C',
    red400: '#FF6B65',
    pink100: 'rgba(255, 92, 182, 0.11)',
    pink200: 'rgba(255, 92, 182, 0.15)',
    pink300: '#FF5CB6',
    pink400: '#FF8BC6',
  },
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    // Primary purple/violet scale
    50: '#9E86FF', // Lt Blurple
    100: '#7553FF', // Blurple
    200: '#6E47AE', // Lt Violet
    300: '#4E2A9A', // Dk Blurple
    400: '#36166B', // Dk Violet
    500: '#4D0A55', // Dk Purple
    600: '#422082', // Interpolated
    700: '#373B4', // Lt Purple
    800: '#2D1A47', // Interpolated
    900: '#181225', // Rich Black
  },
  secondary: {
    // Secondary brand colors
    pink: {
      light: '#FF70BC', // Lt Pink
      dark: '#FF45A8', // Dk Pink
    },
    orange: {
      light: '#FF9838', // Lt Orange
      dark: '#EE8019', // Dk Orange
    },
    yellow: {
      light: '#FFD00E', // Lt Yellow
      dark: '#FDB81B', // Dk Yellow
    },
  },
  tertiary: {
    // Tertiary brand colors
    green: {
      light: '#C0ED49', // Lt Green
      dark: '#92DD00', // Dk Green
    },
    blue: {
      light: '#3EDCFF', // Lt Blue
      dark: '#226DFC', // Dk Blue
    },
  },
  background: {
    dark: '#181225', // Rich Black from brand colors
    grey: '#F6F6F8', // Background Grey
  },
  gray: {
    100: 'rgba(112, 124, 137, 0.05)',
    200: 'rgba(112, 124, 137, 0.09)',
    300: '#707C89',
    400: '#57606B',
    500: '#181423',
  },
  // Gradient colors for potential use
  gradient: {
    purple: {
      start: '#7B51F8',
      mid: '#F644AB',
      end: '#7B51F8',
    },
    coral: {
      start: '#FC8B61',
      mid: '#FC5F64',
      end: '#F32474',
    },
    orange: {
      start: '#EE8019',
      mid: '#FAA80A',
      end: '#FBB20B',
    },
    purpleToOrange: {
      start: '#4E2A9A',
      mid: '#7C30A9',
      end: '#A737B4',
      accent1: '#F2306F',
      accent2: '#EE8019',
    },
  },
};

const fonts = {
  heading: '"Rubik", sans-serif',
  body: '"Rubik", sans-serif',
};

const styles = {
  global: {
    body: {
      bg: 'background.dark',
      color: 'white',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'full',
    },
    variants: {
      solid: {
        bg: 'brand.100', // Blurple
        color: 'white',
        _hover: {
          bg: 'brand.200', // Lt Violet
        },
      },
      outline: {
        borderColor: 'brand.100',
        color: 'brand.100',
        _hover: {
          bg: 'brand.100',
          color: 'white',
        },
      },
      gradient: {
        bgGradient: 'linear(to-r, brand.100, secondary.pink.light)',
        color: 'white',
        _hover: {
          bgGradient: 'linear(to-r, brand.200, secondary.pink.dark)',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      letterSpacing: 'tight',
      color: 'white',
    },
  },
  Link: {
    baseStyle: {
      color: 'brand.100',
      _hover: {
        textDecoration: 'none',
        color: 'brand.50',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'brand.900',
        borderColor: 'brand.800',
      },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
});

export default theme;
