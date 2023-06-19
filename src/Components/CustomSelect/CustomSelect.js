import Select from "react-select";

const CustomSelect = (props) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused
        ? "1px solid #455468"
        : state.isDisabled
        ? "1px solid rgba(69, 84, 104, 0.4)"
        : "1px solid #455468",
      boxShadow: state.isFocused ? null : null,
      backgroundColor: state.isDisabled ? "white" : provided.backgroundColor,
      "&:hover": {
        border: state.isFocused
          ? "1px solid #455468"
          : state.isDisabled
          ? "1px solid rgba(69, 84, 104, 0.4)"
          : "1px solid #455468",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgba(191, 0, 38, 0.15)" : null,
      color: "black",
      "&:hover": {
        backgroundColor: state.isSelected
          ? "rgba(191, 0, 38, 0.05)"
          : "rgba(191, 0, 38, 0.05)",
      },
    }),
  };

  return (
    <Select
      value={props.formData.type}
      placeholder="Select the type of application"
      styles={customStyles}
      isClearable
      onChange={(e) => {
        props.setSaved(false);
        if (e) {
          props.setFormData({
            ...props.formData,
            type: e,
          });
        } else {
          props.setFormData({
            ...props.formData,
            type: "",
          });
        }
      }}
      options={props.types}
    />
  );
};

export default CustomSelect;
