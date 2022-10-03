import { useNavigate } from "react-router-dom";
import {
  SideNavigation,
  SideNavigationItem,
  BusyIndicator,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/shipping-status";

import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";
import { useSAPGlobalData } from "context/sapDataContext";

const getIcon = (sApp) => {
  switch (sApp) {
    case "TRANS_ORDER":
      return "shipping-status";
    case "translate":
      return "";
  }
};

export default function ListApps() {
  const { getI18nText } = useTranslations();
  const { loadingListApps, setLoadingListApps, setShowListApps } =
    useGlobalData();
  const { appsList } = useSAPGlobalData();
  const navigate = useNavigate();

  return (
    <>
      <BusyIndicator
        active={loadingListApps}
        text={getI18nText("systemSelect.loadingSystemData")}
      >
        <SideNavigation
          sx={{ border: "0px" }}
          onSelectionChange={(event) => {
            setShowListApps(false);
            navigate(event.detail.item.id);
          }}
        >
          {appsList &&
            appsList.map((row) => {
              return (
                <SideNavigationItem
                  key={row.app}
                  text={row.appDesc == "" ? row.app : row.appDesc}
                  icon={getIcon(row.app)}
                  id={row.frontendPage}
                />
              );
            })}
        </SideNavigation>
      </BusyIndicator>
    </>
  );
}
