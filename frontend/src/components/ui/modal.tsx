import { Modal as _Modal } from "@mantine/core";

const Modal = ({ children, opened, onClose, ...props }) => {
  return (
    <_Modal
      title=""
      withCloseButton={false}
      overlayOpacity={0}
      className="drop-shadow-4xl"
      classNames={{ modal: "rounded-xl" }}
      {...props}
      opened={opened}
      onClose={onClose}
    >
      {children}
    </_Modal>
  );
};

export default Modal;
