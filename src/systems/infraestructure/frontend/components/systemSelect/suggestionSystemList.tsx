import { FC, useCallback } from "react";
import System from "systems/domain/entities/system";
import { SuggestionItem } from "@ui5/webcomponents-react";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";
import FormatterSystemNameSelected from "systems/infraestructure/frontend/components/shared/formatterSystemNameSelected";
import { useTranslations } from "translations/i18nContext";

interface Props {
  systemsList: System[];
}

/*
 bSystemSelected
            ? formatterSystemNameSelected(row.name)
            : row.name
*/

const SuggestionSystemList: FC<Props> = (props) => {
  const { systemsList } = props;
  const { isSystemSelected } = useSystems();
  const { getI18nText } = useTranslations();

  return (
    <>
      {systemsList.map((row) => {
        let bSystemSelected = isSystemSelected(row._id);
        return (
          <SuggestionItem
            id={row._id}
            key={row._id}
            additionalText={
              bSystemSelected
                ? getI18nText("systemSelect.sufixSystemSelected")
                : ""
            }
            text={row.name}
          />
        );
      })}
    </>
  );
};

export default SuggestionSystemList;
