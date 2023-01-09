import { useCallback, useState, useEffect } from "react";
import "@ui5/webcomponents-icons/dist/account";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import { Input, SuggestionItem, Popover } from "@ui5/webcomponents-react";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";
import SystemController from "systems/infraestructure/controller/SystemController.ts";
import useSystems from "hooks/useSystems";
import DropdownIcon from "./dropdownIcon";
import ComboSystemList from "./comboSystemList";

export default function SystemSelect2(props) {
  const { getI18nText } = useTranslations();
  const { systemsList, systemSelected } = useGlobalData();
  const [haveSystems, setHaveSystems] = useState(false);
  const {
    isSystemSelected,
    loadingSystems,
    srvGetUserSystems,
    processSelectedSystem,
  } = useSystems();
  const { session } = useSession();
  const [openComboSystemList, setOpenComboSystemList] = useState(false);
  const [systemValue, setSystemValue] = useState("");
  const [systemID, setSystemID] = useState("");
  const systemController = new SystemController();

  /*************************************
   * Efectos
   ************************************/
  // Efecto que me gestionará si hay sistemas en el array principal. Esto me simplifica determinadas operaciones
  useEffect(() => {
    // Me guardo si hay sistemas
    if (Array.isArray(systemsList))
      setHaveSystems(systemsList.length > 0 ? true : false);
    else setHaveSystems(false);
  }, [systemsList]);

  useEffect(() => {
    if (session?.email) {
      srvGetUserSystems();
      /*  systemController.getUserSystems(session.email).then((response) => {
        console.log(response);
      });*/
    }
  }, [session]);

  useEffect(() => {
    if (systemID != "") {
      let row = systemsList.find((row) => row._id == systemID);
      if (row) {
        setSystemValue(row.name);
      }
      processSelectedSystem(systemID);
    }
  }, [systemID]);
  /*************************************
   * Funciones
   ************************************/
  /**
   * Se formate el sistema seleccionado.
    @param sName | Nombre del sistema
   */
  const formatterSystemNameSelected = useCallback((sName) => {
    return (
      <strong>
        {sName + " " + getI18nText("systemSelect.sufixSystemSelected")}
      </strong>
    );
  });

  return (
    <>
      <Input
        id="inputSystemSelect"
        icon={
          <DropdownIcon
            openSystemList={openComboSystemList}
            onClick={() => {
              setOpenComboSystemList(!openComboSystemList);
            }}
          />
        }
        showSuggestions={true}
        placeholder={
          loadingSystems
            ? getI18nText("systemSelect.loadingSystemData")
            : getI18nText("systemSelect.placeholder")
        }
        value={systemValue}
        onChange={(e) => {
          let row = systemsList.find(
            (row) => row.name == e.target.lastConfirmedValue
          );
          if (row) {
            //setSystemValue(row.name);

            setSystemID(row._id);
          }
        }}
      >
        {haveSystems &&
          systemsList.map((row) => {
            let bSystemSelected = isSystemSelected(row._id);
            return (
              <SuggestionItem
                id={row._id}
                key={row._id}
                text={
                  bSystemSelected
                    ? formatterSystemNameSelected(row.name)
                    : row.name
                }
              />
            );
          })}
      </Input>
      <Popover
        opener="inputSystemSelect"
        open={openComboSystemList}
        placementType="Bottom"
        onAfterClose={() => {
          setOpenComboSystemList(false);
        }}
      >
        <ComboSystemList
          formatterSystemNameSelected={formatterSystemNameSelected}
          isSystemSelected={isSystemSelected}
          handlerIitemClick={(system) => {
            setSystemID(system);
            setOpenComboSystemList(false);
          }}
        />
      </Popover>
    </>
  );
}
