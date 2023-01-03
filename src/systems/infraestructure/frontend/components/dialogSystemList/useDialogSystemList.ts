import { useCallback, useEffect, useState } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";
import CellActions from "systems/infraestructure/frontend/components/dialogSystemList/cellActions";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";
import { SystemController } from "systems/infraestructure/controller/SystemController";
import { RowValidations } from "shared/types/validation";
import { showToast, MESSAGE } from "utils/general/message";
import SystemFormatters from "systems/utils/formatters";
import Encrypt from "shared/utils/encrypt/Encrypt";
import System from "systems/domain/entities/system";
import type { responseSystemRepo } from "systems/infraestructure/types/repository";
import ErrorGraphql from "shared/errors/ErrorGraphql";

export default function useDialogSystemList() {
  const { getI18nText } = useTranslations();
  const [columns, setColumns] = useState<any>([]);
  const systemController = new SystemController();
  const { updateSystem, deleteSystem } = useSystems();

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    setColumns([
      {
        Cell: CellActions,
        Header: "Actions",
        accessor: "actions",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        numberIcons: 2,
        id: "actions",
      },
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
        Header: getI18nText("systems.labelConnectionTunnel"),
        accessor: "connection_tunnel",
        headerTooltip: getI18nText("systems.labelConnectionTunnel"),
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
        case "connection_tunnel":
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
              { column: "connection_tunnel", value: "" },
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
  const rowUpdate = (newData: any, oldData: any): Promise<any> => {
    showToast(
      getI18nText("editSystem.saveInProcess", {
        newSystem: newData.name,
      }),
      MESSAGE.TYPE.INFO
    );

    return new Promise((resolve, reject) => {
      systemController
        .updateSystem(
          new System(
            newData._id,
            newData.user,
            newData.name,
            SystemFormatters.formatterHost(newData.host),
            newData.sap_user,
            newData.sap_password != oldData.sap_password
              ? Encrypt.encryptText(newData.sap_password)
              : newData.sap_password,
            newData.ngrok_active,
            newData.ngrok_active &&
            newData.ngrok_api_token != oldData.ngrok_api_token
              ? Encrypt.encryptText(newData.ngrok_api_token)
              : newData.ngrok_api_token,
            newData.ngrok_active &&
            newData.connection_tunnel != "" &&
            newData.connection_tunnel != null
              ? SystemFormatters.formatterHost(newData.connection_tunnel)
              : ""
          )
        )
        .then((response: responseSystemRepo) => {
          if (response.isSuccess) {
            let updatedSystem = response.getValue() as System;
            showToast(
              getI18nText("editSystem.saveSuccess", {
                newSystem: updatedSystem.name,
              }),
              MESSAGE.TYPE.SUCCCES
            );
            updateSystem(updatedSystem); // Actualización del modelo interno
            resolve("");
          } else if (response.isFailure) {
            let error = (response.getErrorValue() as ErrorGraphql).getError();

            showToast(
              getI18nText("editSystem.errorCallServiceNew", {
                errorService: error.singleMessage,
              }),
              MESSAGE.TYPE.ERROR
            );

            reject(new Error(error.singleMessage)); // Lanzo excepción para que se pinta en el listado
          }
        });
    });
  };

  /**
   * Borrado de una fila
   */
  const rowDelete = (oldData: any) => {
    showToast(
      getI18nText("editSystem.deleteInProcess", {
        newSystem: oldData.name,
      }),
      MESSAGE.TYPE.INFO
    );

    return new Promise((resolve, reject) => {
      systemController
        .deleteSystem(oldData._id)
        .then((response: responseSystemRepo) => {
          if (response.isSuccess) {
            let deletedSystem = response.getValue() as System;

            showToast(
              getI18nText("editSystem.deleteSuccess", {
                system: deletedSystem.name,
              }),
              MESSAGE.TYPE.SUCCCES
            );

            deleteSystem(deletedSystem._id);
            resolve("");
          } else if (response.isFailure) {
            let error = (response.getErrorValue() as ErrorGraphql).getError();

            showToast(
              getI18nText("editSystem.errorCallServiceNew", {
                errorService: error.singleMessage,
              }),
              MESSAGE.TYPE.ERROR
            );

            reject(new Error(error.singleMessage)); // Lanzo excepción para que se pinta en el listado
          }
        });
    });
  };

  return { columns, rowValidations, rowUpdate, rowDelete };
}
