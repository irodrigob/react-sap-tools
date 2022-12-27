import { FC, useCallback } from "react";
import {
  Popover,
  List,
  StandardListItem,
  Bar,
  Button,
  Ui5CustomEvent,
  ListDomRef,
} from "@ui5/webcomponents-react";
import FooterSystemList from "systems/infraestructure/frontend/components/systemSelect/footerSystemList";
import System from "systems/domain/entities/system";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";
import { useTranslations } from "translations/i18nContext";

interface Props {
  opener: string;
  open: boolean;
  onAfterClose: () => void;
  systemsList: System[];
  handlerSystemSelected: (systemSelected: string) => void;
  handlerOpenAddSystem: () => void;
  handlerOpenSystemList: () => void;
}

const ComboSystemList: FC<Props> = (props) => {
  const {
    onAfterClose,
    open,
    opener,
    handlerSystemSelected,
    systemsList,
    handlerOpenAddSystem,
    handlerOpenSystemList,
  } = props;
  const { getI18nText } = useTranslations();
  const { isSystemSelected } = useSystems();

  /*************************************
   * Funciones
   ************************************/
  /**
   * Se formate el sistema seleccionado.
    @param sName | Nombre del sistema
   */
  const formatterSystemNameSelected = useCallback((sName: string) => {
    return (
      <strong>
        {sName + " " + getI18nText("systemSelect.sufixSystemSelected")}
      </strong>
    );
  }, []);

  return (
    <Popover
      opener={opener}
      open={open}
      placementType="Bottom"
      onAfterClose={onAfterClose}
    >
      <List
        header={false}
        growing="Scroll"
        onItemClick={(
          e: Ui5CustomEvent<
            ListDomRef,
            {
              item: HTMLElement;
            }
          >
        ) => {
          const { value } = e.detail.item.dataset;
          handlerSystemSelected(value as string);
        }}
      >
        {Array.isArray(systemsList) &&
          systemsList.map((row) => {
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
      <FooterSystemList
        systemsList={systemsList}
        handlerOpenAddSystem={handlerOpenAddSystem}
        handlerOpenSystemList={handlerOpenSystemList}
      />
    </Popover>
  );
};

export default ComboSystemList;
