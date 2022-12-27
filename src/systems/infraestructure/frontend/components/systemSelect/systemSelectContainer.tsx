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
import { responseSystemRepoArray } from "systems/infraestructure/types/general";
import System from "systems/domain/entities/system";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import { showToast, MESSAGE } from "utils/general/message";
import ComboSystemList from "systems/infraestructure/frontend/components/systemSelect/comboSystemList";
import DialogAddSystem from "systems/infraestructure/frontend/components/dialogAddSystem/dialogAddSystemContainer";
import DialogSystemListContainer from "systems/infraestructure/frontend/components/dialogSystemList/dialogSystemListContainer";

interface Props {
  //children: React.ReactNode;
}

const SystemSelectContainer: FC<Props> = () => {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { setSystemsList, systemsList, systemSelected } = useSystemData();
  const [openComboSystemList, setOpenComboSystemList] = useState(false);
  const [loadingSystems, setLoadingSystems] = useState(true);
  const { processSelectedSystem } = useSystems();
  const [openAddSystem, setOpenAddSystem] = useState(false);
  const [openDialogSystemList, setOpenDialogSystemList] = useState(false);
  const systemController = new SystemController();

  /*************************************
   * Funciones
   ************************************/

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    if (session?.email) {
      systemController
        .getUserSystems(session.email)
        .then((response: responseSystemRepoArray) => {
          setLoadingSystems(false);
          if (response.isSuccess) {
            setSystemsList(response.getValue() as System[]);
          } else if (response.isFailure) {
            showToast(
              getI18nText("editSystem.errorCallServiceNew", {
                errorService: (
                  response.getErrorValue() as ErrorGraphql
                ).getError().singleMessage,
              }),
              MESSAGE.TYPE.ERROR
            );
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
        systemsList={systemsList}
        handlerSystemSelected={(systemSelected: string) => {
          let row = systemsList.find((row) => row._id == systemSelected);
          if (row) {
            processSelectedSystem(row);
          }
        }}
        handlerOpenAddSystem={() => {
          setOpenAddSystem(true);
        }}
        handlerOpenSystemList={() => {
          setOpenDialogSystemList(true);
        }}
      />
      <DialogAddSystem
        open={openAddSystem}
        onCloseButton={() => {
          setOpenAddSystem(false);
        }}
      />
      <DialogSystemListContainer
        open={openDialogSystemList}
        onCloseButton={() => {
          setOpenDialogSystemList(false);
        }}
      />
    </>
  );
};

export default SystemSelectContainer;
