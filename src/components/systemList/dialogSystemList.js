import { useEffect, useState } from "react";
import {
  Dialog,
  Button,
  Bar,
  Text,
  AnalyticalTable,
  FlexBox,
  Input,
  Label,
} from "@ui5/webcomponents-react";
import { AnalyticalTableHooks } from "@ui5/webcomponents-react";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";

const FooterDialog = (props) => {
  const { onCloseButton } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={props.slot}
      design="Footer"
      endContent={
        <Button style={{ marginTop: "1rem" }} onClick={onCloseButton}>
          {getI18nText("general.btnTxtCancel")}
        </Button>
      }
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    />
  );
};

export default function DialogSystemList(props) {
  const { open, onCloseButton } = props;
  const { getI18nText } = useTranslations();
  const { systemsList } = useGlobalData();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        Header: getI18nText("systems.labelName"),
        accessor: "name",
        headerTooltip: getI18nText("systems.labelName"),
        edit: true,
        required: true,
        width: 270,
        defaultCanSort: true,
      },
      {
        Header: getI18nText("systems.labelHOST"),
        accessor: "host",
        headerTooltip: getI18nText("systems.labelHOST"),
        //edit:true
        width: 500,
      },
      {
        Header: getI18nText("systems.labelSAPUser"),
        accessor: "sap_user",
        headerTooltip: getI18nText("systems.labelSAPUser"),
        //edit:true
        width: 150,
      },
      {
        Header: getI18nText("systems.labelSAPPassword"),
        accessor: "sap_password",
        headerTooltip: getI18nText("systems.labelSAPPassword"),
        //edit:true
        width: 300,
      },
    ]);
  }, []);

  /*

  */
  return (
    <Dialog
      open={open}
      headerText={getI18nText("systemList.title")}
      draggable={true}
      resizable={true}
      footer={
        <FooterDialog
          onCloseButton={() => {
            onCloseButton();
          }}
        />
      }
    >
      <CustomAnalyticTable
        columns={columns}
        data={systemsList}
        visibleRows={5}
        allowDelete={true}
        editable={{
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
              reject();
            });
          },
        }}
      />
    </Dialog>
  );
}
