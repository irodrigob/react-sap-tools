import { FC, useState } from "react";
import IconInteractive from "shared/frontend/components/iconInteractive";
import {
  Popover,
  List,
  StandardListItem,
  Ui5CustomEvent,
  ListDomRef,
} from "@ui5/webcomponents-react";
import PopupTunnelConfiguration from "systems/infraestructure/frontend/components/systemConfiguration/popupTunnelConfiguration";
import { useTranslations } from "translations/i18nContext";

const SystemConfigurationContainer: FC = () => {
  const [open, setOpen] = useState(false);
  const [openPopupTunnel, setOpenPopupTunnel] = useState(false);
  const { getI18nText } = useTranslations();
  return (
    <>
      <IconInteractive
        name="settings"
        id="systemConfiguration"
        sx={{
          width: "1rem",
          height: "1rem%",
          marginTop: "0.66rem",
          color: "var(--sapButton_Lite_TextColor)",
        }}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Popover
        opener="systemConfiguration"
        open={open}
        placementType="Bottom"
        onAfterClose={() => {
          setOpen(false);
        }}
      >
        <List
          onItemClick={(
            e: Ui5CustomEvent<
              ListDomRef,
              {
                item: HTMLElement;
              }
            >
          ) => {
            const { value } = e.detail.item.dataset;
            switch (value) {
              case "tunnelConf":
                setOpenPopupTunnel(true);
                break;
            }
          }}
        >
          <StandardListItem
            key="tunnelConf"
            data-value="tunnelConf"
            style={{ border: "0px" }}
          >
            {getI18nText("systemConfiguration.tunnelConfiguration")}
          </StandardListItem>
        </List>
      </Popover>
      <PopupTunnelConfiguration
        open={openPopupTunnel}
        onCloseButton={() => {
          setOpenPopupTunnel(false);
        }}
      />
    </>
  );
};

export default SystemConfigurationContainer;
