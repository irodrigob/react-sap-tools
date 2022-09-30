import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  BusyIndicator,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/shipping-status";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";
import { useSAPGlobalData } from "context/sapDataContext";

/*
<SideNavigationItem icon="home" text="Home" />
          <SideNavigationItem expanded icon="group" text="People">
            <SideNavigationSubItem text="From My Team" />
            <SideNavigationSubItem text="From Other Teams" />
          </SideNavigationItem>
          <SideNavigationItem icon="locate-me" selected text="Locations" />
          <SideNavigationItem icon="calendar" text="Events">
            <SideNavigationSubItem text="Local" />
            <SideNavigationSubItem text="Others" />
          </SideNavigationItem>
*/

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
  const { loadingListApps, setLoadingListApps } = useGlobalData();
  const { appsList } = useSAPGlobalData();

  return (
    <>
      <BusyIndicator
        active={loadingListApps}
        text={getI18nText("systemSelect.loadingSystemData")}
      >
        <SideNavigation sx={{ border: "0px" }}>
          {appsList &&
            appsList.map((row) => {
              return (
                <SideNavigationItem
                  key={row.app}
                  text={row.appDesc == "" ? row.app : row.appDesc}
                  icon={getIcon(row.app)}
                />
              );
            })}
        </SideNavigation>
      </BusyIndicator>
    </>
  );
}