import { useState, FC } from "react";
import { Dialog, Button } from "@ui5/webcomponents-react";
import FooterDialog from "systems/infraestructure/frontend/components/dialogSystemList/footerDialog";
import { useTranslations } from "translations/i18nContext";

interface Props {
  open: boolean;
  onCloseButton: () => void;
}

const DialogSystemListContainer: FC<Props> = (props) => {
  const { onCloseButton, open } = props;
  const { getI18nText } = useTranslations();
  return (
    <Dialog
      open={open}
      headerText={getI18nText("editSystem.titleAddSystem")}
      footer={
        <FooterDialog
          onCloseButton={() => {
            onCloseButton();
          }}
        />
      }
    ></Dialog>
  );
};

export default DialogSystemListContainer;
