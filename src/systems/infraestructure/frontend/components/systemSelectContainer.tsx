import { useEffect, FC,useState } from "react";
import "@ui5/webcomponents-icons/dist/account";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import { Input, SuggestionItem, Popover } from "@ui5/webcomponents-react";
import DropdownIcon from "shared/components/dropdownIcon";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";
import { SystemController } from "systems/infraestructure/controller/SystemController";
import { useSystemData } from "systems/context/systemContext";
import System from "systems/domain/entities/system";
import { showToast, MESSAGE } from "utils/general/message";

interface Props {
  children: React.ReactNode;
}

const SystemSelectContainer:FC<Props> = () => {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { setSystemsList } = useSystemData();
  const systemController = new SystemController();
  const [openComboSystemList, setOpenComboSystemList] = useState(false);
  const [loadingSystems,setLoadingSystems]=useState(true)
  
  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    if (session?.email) {
      systemController.getUserSystems(session.email).then((response) => {
        setLoadingSystems(false)
        if (response.isSuccess) {
          setSystemsList((response.getValue() as System[]));
        }
      });
    }
  }, [session]);

  return       <Input
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
  //value={systemValue}
  onChange={(e) => {
  
  }}
>
  </Input>
};

export default SystemSelectContainer;
