import { useState, FC } from "react";
import { Dialog, Button, FlexBox } from "@ui5/webcomponents-react";
import FooterDialog from "systems/infraestructure/frontend/components/dialogSystemList/footerDialog";
import { useTranslations } from "translations/i18nContext";
import useDialogSystemList from "./useDialogSystemList";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { useSystemData } from "systems/context/systemContext";

interface Props {
  open: boolean;
  onCloseButton: () => void;
}

const DialogSystemListContainer: FC<Props> = (props) => {
  const { onCloseButton, open } = props;
  const { getI18nText } = useTranslations();
  const { columns } = useDialogSystemList();
  const { systemsList } = useSystemData();
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
    >
      {Array.isArray(systemsList) && (
        <CustomAnalyticTable columns={columns} data={systemsList} />
      )}
    </Dialog>
  );
};

export default DialogSystemListContainer;
