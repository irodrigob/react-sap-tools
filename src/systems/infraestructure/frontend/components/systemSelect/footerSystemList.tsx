import { FC } from "react";
import { Bar, Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/add";
import "@ui5/webcomponents-icons/dist/activities";
import { useTranslations } from "translations/i18nContext";
import System from "systems/domain/entities/system";

interface Props {
  systemsList: System[];
}

const FooterSystemList: FC<Props> = (props) => {
  const { systemsList } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      design="Footer"
      startContent={
        <Button
          style={{ marginTop: "1rem" }}
          icon="activities"
          disabled={
            Array.isArray(systemsList) && systemsList.length > 0 ? false : true
          }
          onClick={() => {
            //setOpenSystemList(true);
          }}
        >
          {getI18nText("systemSelect.btnViewSystems")}
        </Button>
      }
      endContent={
        <Button
          style={{ marginTop: "1rem" }}
          icon="add"
          onClick={() => {
            //setOpenAddSystem(true);
          }}
        >
          {getI18nText("systemSelect.btnNewSystem")}
        </Button>
      }
      style={{
        backgroundColor: "var(--sapPageHeader_Background)",
        marginTop: "1rem",
      }}
    />
  );
};

export default FooterSystemList;
