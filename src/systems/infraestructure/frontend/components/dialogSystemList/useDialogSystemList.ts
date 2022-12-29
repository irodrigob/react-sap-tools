import { useCallback, useEffect, useState } from "react";
import { ValueState, FlexBox, Button } from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";
import IconInteractive from "shared/components/iconInteractive";
import CellAction from "./cellContents";
import { SystemController } from "systems/infraestructure/controller/SystemController";
import { RowValidations } from "shared/types/validation";
import { showToast, MESSAGE, closeToast } from "utils/general/message";
import SystemFormatters from "systems/utils/formatters";

export default function useDialogSystemList() {
  const { getI18nText } = useTranslations();
  const [columns, setColumns] = useState<any>([]);
  const systemController = new SystemController();

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    setColumns([
      /*  {
        Cell: CellAction,
        Header: "Actions",
        accessor: "actions",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        numberIcons: 1,
        id: "actions",
      },*/
      {
        Header: getI18nText("systems.labelName"),
        accessor: "name",
        headerTooltip: getI18nText("systems.labelName"),
        edit: true,
        required: true,
        width: 200,
      },
      {
        Header: getI18nText("systems.labelHOST"),
        accessor: "host",
        headerTooltip: getI18nText("systems.labelHOST"),
        edit: true,
        required: true,
        width: 400,
      },
      {
        Header: getI18nText("systems.labelSAPUser"),
        accessor: "sap_user",
        headerTooltip: getI18nText("systems.labelSAPUser"),
        edit: true,
        required: true,
        width: 150,
      },
      {
        Header: getI18nText("systems.labelSAPPassword"),
        accessor: "sap_password",
        headerTooltip: getI18nText("systems.labelSAPPassword"),
        edit: true,
        required: true,
        width: 150,
        type: "Password",
      },
      {
        Header: getI18nText("systems.labelNgrokActive"),
        accessor: "ngrok_active",
        headerTooltip: getI18nText("systems.labelNgrokActive"),
        edit: true,
        required: false,
        width: 100,
        componentType: "checkbox",
      },
      {
        Header: getI18nText("systems.labelNgrokApiToken"),
        accessor: "ngrok_api_token",
        headerTooltip: getI18nText("systems.labelNgrokApiToken"),
        edit: true,
        required: false,
        width: 200,
        type: "Password",
      },
      {
        Header: getI18nText("systems.labelNgrokTunnel"),
        accessor: "ngrok_tunnel",
        headerTooltip: getI18nText("systems.labelNgrokTunnel"),
        edit: true,
        required: false,
        width: 300,
      },
    ]);
  }, []);

  /*************************************
   * Funciones
   ************************************/
  /**
   * Validación de datos a nivel de fila
   */
  const rowValidations = useCallback(
    (newData: any, column: string, value: any): RowValidations => {
      switch (column) {
        case "host":
          if (!systemController.validateHost(value))
            return [
              {
                column: column,
                validations: [
                  {
                    state: ValueState.Error,
                    message: getI18nText("editSystem.msgErrorHostInvalid"),
                  },
                ],
              },
            ] as RowValidations;
          break;
        case "ngrok_tunnel":
          if (newData.ngrok_active) {
            if (!systemController.validateHost(value))
              return [
                {
                  column: column,
                  validations: [
                    {
                      state: ValueState.Error,
                      message: getI18nText("editSystem.msgErrorHostInvalid"),
                    },
                  ],
                },
              ] as RowValidations;
          } else {
            return [{ value: "" }] as RowValidations;
          }

          break;
        case "ngrok_active":
          if (!value)
            return [
              { column: "ngrok_api_token", value: "" },
              { column: "ngrok_tunnel", value: "" },
            ] as RowValidations;
          break;
        case "ngrok_api_token":
          if (!newData.ngrok_active) return [{ value: "" }] as RowValidations;
          break;
      }
      return [] as RowValidations;
    },
    []
  );

  /**
   * Actualización de datos
   */
  const rowUpdate = useCallback((newData: any, oldData: any): Promise<any> => {
    showToast(
      getI18nText("editSystem.saveInProcess", {
        newSystem: newData.name,
      }),
      MESSAGE.TYPE.INFO
    );

    return new Promise((resolve, reject) => {
      resolve("");
    });
  }, []);

  return { columns, rowValidations, rowUpdate };
}
