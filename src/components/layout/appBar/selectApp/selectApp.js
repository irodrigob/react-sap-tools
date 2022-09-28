import { useState } from "react";
import { Button, Popover } from "@ui5/webcomponents-react";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";
import ListApps from "./listApps";

export default function SelectApp() {
  const { getI18nText } = useTranslations();
  const { setShowListApps, showListApps } = useGlobalData();
  const [open, setOpen] = useState(false);

  /*

       <Popover
            opener="listApps"
            open={showListApps}
            placementType="Bottom"
            onAfterClose={() => {
              setShowListApps(false);
            }}
            style={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <ListApps />
          </Popover>

  */
  return (
    <>
      <Button
        icon="menu2"
        id="listApps"
        onClick={() => {
          setShowListApps(true);
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
