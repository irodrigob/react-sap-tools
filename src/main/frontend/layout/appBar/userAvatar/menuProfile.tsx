import { FC } from "react";
import { List, StandardListItem } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/account";
import { useTranslations } from "translations/i18nContext";
import { useSession } from "auth/authProvider";
import useGoogle from "auth/hooks/useGoogle";

const MenuProfile: FC = () => {
  const { getI18nText } = useTranslations();
  const { session } = useSession();
  const { promptLogin } = useGoogle();

  return (
    <List headerText={session.name} onItemClick={(e) => {}}>
      <StandardListItem icon="account" onClick={promptLogin}>
        {getI18nText("appToolbar.menuProfile.changeUser")}
      </StandardListItem>
    </List>
  );
};

export default MenuProfile;
