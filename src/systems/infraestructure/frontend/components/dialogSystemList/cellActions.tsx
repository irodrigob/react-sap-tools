import { FC, useCallback } from "react";
import { FlexBox } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/upload-to-cloud";
import IconInteractive from "shared/components/iconInteractive";
import System from "systems/domain/entities/system";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";
import { useSystemData } from "systems/context/systemContext";
import TunnelController from "ngrokTunnel/infraestructure/controller/tunnelController";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import Tunnel from "ngrokTunnel/domain/entities/tunnel";

interface Props {
  valor: string;
}

const CellActions: FC<Props> = (instance: any) => {
  const { getI18nText } = useTranslations();
  const { systemsList } = useSystemData();
  const tunnelController = new TunnelController();

  /**
   * Actualiza el tunel de conexión de un sistema
   * @param systemID | ID del sistema
   * @returns | Resultado del proceso
   */
  const updateSystemTunnel = useCallback(
    async (systemID: string): Promise<void> => {
      let system = systemsList.find((row) => row._id == systemID) as System;
      let tunnels = await tunnelController.getTunnels(
        system.ngrok_api_token as string
      );
      if (tunnels.isSuccess) {
        let tunnelsList = tunnels.getValue() as Tunnel[];
        if (tunnelsList.length > 0) {
          // Tiene que haber tuneles
          // Se mira que exista algún tunel para el sistema seleccionado
          let tunnelSystemSelected = tunnelsList.find(
            (row) => row.forwards_to.indexOf(system.host) != -1
          ) as Tunnel;
          if (tunnelSystemSelected) {
          } else {
            showToast(
              getI18nText("systemList.tunneling.noTunnelSystemSelected"),
              MESSAGE.TYPE.INFO
            );
          }
        } else {
          showToast(
            getI18nText("systemList.tunneling.noTunnelsConnected"),
            MESSAGE.TYPE.INFO
          );
        }
      } else if (tunnels.isFailure) {
        let error = (tunnels.getErrorValue() as ErrorGraphql).getError();

        showToast(
          getI18nText("systemList.tunneling.errorGetTunnels", {
            errorService: error.singleMessage,
          }),
          MESSAGE.TYPE.ERROR
        );
      }

      //return new Promise((resolve, reject) => {});
    },
    []
  );

  return (
    <FlexBox>
      <IconInteractive
        name="upload-to-cloud"
        showTooltip={true}
        onClick={() => {
          if (instance.row.original.ngrok_active) {
            if (instance.row.original.ngrok_api_token != "") {
              updateSystemTunnel(instance.row.original._id);
            } else {
              showToast(
                getI18nText("systemList.tunneling.noAPIToken"),
                MESSAGE.TYPE.INFO
              );
            }

            /* showToast(
              getI18nText("systemList.tunneling.updateTunel"),
              MESSAGE.TYPE.INFO
            );*/
          } else {
            showToast(
              getI18nText("systemList.tunneling.noActiveTunnel"),
              MESSAGE.TYPE.INFO
            );
          }
        }}
      />
    </FlexBox>
  );
};

export default CellActions;
