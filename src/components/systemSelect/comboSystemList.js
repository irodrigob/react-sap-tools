import { useCallback, useState } from "react";
import { List, StandardListItem, Bar, Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/add";
import "@ui5/webcomponents-icons/dist/activities";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";
import DialogAddSystem from "components/addSystem/dialogAddSystem";
import DialogSystemList from "components/systemList/dialogSystemList";

export default function ComboSystemList(props) {
  const { formatterSystemNameSelected, isSystemSelected, handlerIitemClick } =
    props;
  const { getI18nText } = useTranslations();
  const [openAddSystem, setOpenAddSystem] = useState(false);
  const [openSystemList, setOpenSystemList] = useState(false);
  const { systemsList } = useGlobalData();

  /*************************************
   * Funciones
   ************************************/

  return (
    <>
      <List
        header={false}
        growing="Scroll"
        onItemClick={(e) => {
          handlerIitemClick(e.detail.item.dataset.value);
        }}
      >
        {systemsList.map((row) => {
          let bSystemSelected = isSystemSelected(row._id);
          return (
            <StandardListItem key={row._id} data-value={row._id}>
              {bSystemSelected
                ? formatterSystemNameSelected(row.name)
                : row.name}
            </StandardListItem>
          );
        })}
      </List>
      <Bar
        design="Footer"
        startContent={
          <Button
            style={{ marginTop: "1rem" }}
            icon="activities"
            disabled={systemsList.length > 0 ? false : true}
            onClick={() => {
              setOpenSystemList(true);
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
              setOpenAddSystem(true);
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
      <DialogAddSystem
        open={openAddSystem}
        onCloseButton={() => {
          setOpenAddSystem(false);
        }}
      />
      <DialogSystemList
        open={openSystemList}
        onCloseButton={() => {
          setOpenSystemList(false);
        }}
      />
    </>
  );
}
