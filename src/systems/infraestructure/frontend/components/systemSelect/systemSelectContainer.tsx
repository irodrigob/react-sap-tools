import { useEffect, FC, useState } from "react";
import "@ui5/webcomponents-icons/dist/account";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import {
  Input,
  Popover,
  Ui5CustomEvent,
  InputDomRef,
} from "@ui5/webcomponents-react";
import DropdownIcon from "shared/components/dropdownIcon";
import { useSession } from "auth/authProvider";
import SuggestionSystemList from "systems/infraestructure/frontend/components/systemSelect/suggestionSystemList";
import { useTranslations } from "translations/i18nContext";
import { SystemController } from "systems/infraestructure/controller/SystemController";
import { useSystemData } from "systems/context/systemContext";
import System from "systems/domain/entities/system";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";
import { showToast, MESSAGE } from "utils/general/message";
import ComboSystemList from "systems/infraestructure/frontend/components/systemSelect/comboSystemList";

interface Props {
  children: React.ReactNode;
}

const SystemSelectContainer: FC<Props> = () => {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { setSystemsList, systemsList, systemSelected } = useSystemData();
  const [openComboSystemList, setOpenComboSystemList] = useState(false);
  const [loadingSystems, setLoadingSystems] = useState(true);
  const { processSelectedSystem } = useSystems();
  const systemController = new SystemController();

  /*************************************
   * Funciones
   ************************************/

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    if (session?.email) {
      systemController.getUserSystems(session.email).then((response) => {
        setLoadingSystems(false);
        if (response.isSuccess) {
          setSystemsList(response.getValue() as System[]);
        }
      });
    }
  }, [session]);

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
        value={systemSelected.name}
        onChange={(e: Ui5CustomEvent<InputDomRef, never>) => {
          let row = systemsList.find(
            (row) => row.name == e.target.getAttribute("value")
          );
          if (row) {
            processSelectedSystem(row);
          }
        }}
      >
        {" "}
        {Array.isArray(systemsList) && systemsList.length > 0 && (
          <SuggestionSystemList systemsList={systemsList} />
        )}
      </Input>
      <ComboSystemList
        opener="inputSystemSelect"
        open={openComboSystemList}
        onAfterClose={() => {
          setOpenComboSystemList(false);
        }}
        systemList={systemsList}
        handlerSystemSelected={(systemSelected: System) => {}}
      />
    </>
  );
};

export default SystemSelectContainer;
