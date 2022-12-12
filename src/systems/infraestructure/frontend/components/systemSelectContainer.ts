import { useEffect } from "react";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";
import { SystemController } from "systems/infraestructure/controller/SystemController";
import { useSystemData } from "systems/context/systemContext";
import System from "systems/domain/entities/system";
import { showToast, MESSAGE } from "utils/general/message";

const useSystemSelect = () => {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { setSystemsList } = useSystemData();
  const systemController = new SystemController();
  let valores;

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    if (session?.email) {
      systemController.getUserSystems(session.email).then((response) => {
        if (response.isSuccess) {
          //setSystemsList([])
          //setSystemsList(response.getValue());
        }
      });
    }
  }, [session]);

  return { session, getI18nText };
};

export default useSystemSelect;
