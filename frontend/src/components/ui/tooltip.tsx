import { Tooltip as _Tooltip } from "@mantine/core";

const Tooltip = ({ children, label, ...props }) => {
  return (
    <_Tooltip
      position="top"
      openDelay={200}
      classNames={{
        tooltip: "text-xs",
      }}
      {...props}
      label={label}
    >
      {children}
    </_Tooltip>
  );
};

export default Tooltip;
