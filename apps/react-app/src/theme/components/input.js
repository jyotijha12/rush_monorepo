const Input = {
  baseStyle: {
    field: {
      width: "100%",
      minWidth: 0,
      outline: 0,
      bg: "white",
      position: "relative",
      border: "1px solid",
      borderRadius: "6px",
      boxShadow: "none",
      borderColor: "custom.main",
      _focusVisible: {
        borderColor: "custom.main",
        boxShadow: "none",
      },
      _hover: {
        borderColor: "custom.main",
        boxShadow: "none",
      },
    },
  },
  variants: {
    outline: {
      field: {
        bg: "white",
        borderColor: "custom.main",
        boxShadow: "none",
        _focusVisible: {
          borderColor: "custom.main",
          boxShadow: "none",
        },
        _focus: {
          borderColor: "custom.main",
          boxShadow: "none",
        },
        _active: {
          borderColor: "custom.main",
          boxShadow: "none",
        },
        _hover: {
          borderColor: "custom.main",
          boxShadow: "none",
        },
      },
    },
    flushed: {
      field: {
        border: "none",
        bg: "white",
        boxShadow: "none",
        _focusVisible: {
          bg: "white",
          borderColor: "custom.main",
          boxShadow: "none",
        },
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "outline",
  },
};

export default Input;
