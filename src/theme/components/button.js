const Button = {
  // The styles all button have in common
  baseStyle: {
    bg: "primary.main",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.75%",
    borderRadius: "6px",
    _hover: {
      bg: "primary.main",
    },
    _active: {
      bg: "primary.main",
    },
    _disabled: {
      bg: "custom.lighter",
    },
  },
  // Two sizes: sm and md
  sizes: {
    xs: {
      fontSize: "12px",
      lineHeight: "16px",
      padding: "10px, 8px, 10px, 8px",
    },
    sm: {
      fontSize: "14px",
      lineHeight: "20px",
      padding: "10px, 12px, 10px, 12px",
    },
    md: {
      fontSize: "16px",
      lineHeight: "24px",
      padding: "10px, 16px, 10px, 16px",
    },
    lg: {
      fontSize: "18px",
      lineHeight: "28px",
      padding: "10px, 24px, 10px, 24px",
    },
  },
  // Two variants: outline and solid
  variants: {
    base: {},
    primary: {
      bg: "primary.main",
      borderRadius: "6px",
      fontWeight: 700,
      color: "white",
      _hover: {
        bg: "primary.main",
      },
      _active: {
        bg: "primary.main",
      },
      _disabled: {
        bg: "custom.lighter",
      },
    },
    secondary: {
      bg: "custom.main",
      borderRadius: "6px",
      fontWeight: 700,
      color: "white",
      _hover: {
        bg: "custom.main",
      },
      _active: {
        bg: "custom.main",
      },
      _disabled: {
        bg: "custom.lighter",
        _hover: {
          bg: "custom.main",
        },
        _active: {
          bg: "custom.main",
        },
      },
    },
    secondary2: {
      bg: "custom.dark",
      borderRadius: "6px",
      fontWeight: 700,
      color: "white",
      _hover: {
        bg: "custom.dark",
      },
      _active: {
        bg: "custom.dark",
      },
      _disabled: {
        bg: "custom.lighter",
      },
    },
  },

  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "primary",
  },
};

export default Button;
