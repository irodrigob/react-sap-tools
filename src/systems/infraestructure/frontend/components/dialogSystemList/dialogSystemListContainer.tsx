import { useState, FC } from "react";
import { Dialog, Button, FlexBox, ValueState } from "@ui5/webcomponents-react";
import FooterDialog from "systems/infraestructure/frontend/components/dialogSystemList/footerDialog";
import { useTranslations } from "translations/i18nContext";
import useDialogSystemList from "./useDialogSystemList";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { useSystemData } from "systems/context/systemContext";
import SystemController from "systems/infraestructure/controller/SystemController";

interface Props {
  open: boolean;
  onCloseButton: () => void;
}

const DialogSystemListContainer: FC<Props> = (props) => {
  const { onCloseButton, open } = props;
  const { getI18nText } = useTranslations();
  const { columns, rowValidations, rowUpdate, rowDelete } =
    useDialogSystemList();
  const { systemsList } = useSystemData();
  const systemController = new SystemController();
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
        <CustomAnalyticTable
          columns={columns}
          data={systemsList}
          editable={{
            onRowUpdate: (newData: any, oldData: any) => {
              return rowUpdate(newData, oldData);
            },
            onRowDelete: (oldData: any) => {
              return rowDelete(oldData);
            },
            onRowValidation: (newData: any, column: string, value: any) => {
              return rowValidations(newData, column, value);
            },
          }}
        />
      )}
    </Dialog>
  );
};

export default DialogSystemListContainer;
