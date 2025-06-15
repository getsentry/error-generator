import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import '@fontsource/rubik';

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
