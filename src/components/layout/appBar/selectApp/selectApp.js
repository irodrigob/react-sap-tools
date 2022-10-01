import { useState } from "react";
import { Button, Popover } from "@ui5/webcomponents-react";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";
import ListApps from "./listApps";

export default function SelectApp() {
  const { getI18nText } = useTranslations();
  const { setShowListApps, showListApps } = useGlobalData();
  const { systemSelected } = useGlobalData();

  return (
    <>
      <Button
        icon="menu2"
        id="listApps"
        onClick={() => {
          if (systemSelected.name) setShowListApps(true);
          else
            showToast(
              getI18nText("listApps.systemNotSelected"),
              MESSAGE.TYPE.INFO
            );
        }}
        tooltip={getI18nText("appToolbar.tooltipButtonsApps")}
      />
      <Popover
        opener="listApps"
        open={showListApps}
        placementType="Bottom"
        onAfterClose={() => {
          setShowListApps(false);
        }}
      >
        <ListApps />
      </Popover>
    </>
  );
}
