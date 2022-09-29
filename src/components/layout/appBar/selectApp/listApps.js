import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  BusyIndicator,
} from "@ui5/webcomponents-react";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";

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
export default function ListApps() {
  const { getI18nText } = useTranslations();
  const { connectedToSystem } = useGlobalData();
  return (
    <>
      <BusyIndicator
        active={!connectedToSystem}
        text={getI18nText("systemSelect.loadingSystemData")}
      >
        <SideNavigation sx={{ border: "0px" }}></SideNavigation>
      </BusyIndicator>
    </>
  );
}
