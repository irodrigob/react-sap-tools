import { FC } from "react";
import { ValueState, FlexBox, Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/upload-to-cloud";
import IconInteractive from "shared/components/iconInteractive";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE, closeToast } from "utils/general/message";
interface Props {
  // instance: any;
}

const CellActions: FC<Props> = (instance: any) => {
  //const { instance } = props;
  const { getI18nText } = useTranslations();
  return (
    <FlexBox>
      <IconInteractive
        name="upload-to-cloud"
        showTooltip={true}
        // instance={instance}
        onClick={() => {
          //debugger;
          if (instance.row.original.ngrok_active) {
            showToast(
              getI18nText("systemList.tunneling.updateTunel"),
              MESSAGE.TYPE.INFO
            );
          } else {
            showToast(
              getI18nText("systemList.tunneling.noActive"),
              MESSAGE.TYPE.INFO
            );
          }
        }}
      />
    </FlexBox>
  );
};

export default CellActions;
