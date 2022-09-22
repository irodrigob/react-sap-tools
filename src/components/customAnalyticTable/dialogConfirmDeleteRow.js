import { MessageBox } from "@ui5/webcomponents-react";

export default function DialogConfirmDeleteRow(props) {
  const { open, onClose } = props;

  return (
    <>
      <MessageBox open={open} onClose={onClose}>
        Content
      </MessageBox>
    </>
  );
}
