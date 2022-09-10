import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { ComboBox, ComboBoxItem } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/account";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";
import useSystems from "hooks/useSystems";

export default function SystemSelect(props) {
  const inputRef = useRef(null);
  const { getI18nText } = useTranslations();
  const { systemsList, systemSelected } = useGlobalData();
  const [haveSystems, setHaveSystems] = useState(false);
  const { isSystemSelected, loadingSystems, srvGetUserSystems } = useSystems();
  const { session } = useSession();

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
    }
  }, [session]);

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

  const aSystems = useMemo(() => {
    if (Array.isArray(systemsList)) {
      return systemsList.filter((row) => {
        // Paso a mayúsculas para poder comparar en igualdad de condiciones
        // let nameUpper = row.name.toUpperCase();
        // let filterUpper = filterSystem.toUpperCase();
        // return nameUpper.includes(filterUpper);
        return row;
      });
    } else {
      return [];
    }
  }, [systemsList]);
  /*
 <StandardListItem>
          <Input
            placeholder="test"
            onClick={() => {
              debugger;
            }}
          />
        </StandardListItem>


         <StandardListItem>
          <Button
            onClick={(event) => {
              console.log("boton");
            }}
          >
            Prueba
          </Button>
        </StandardListItem>
*/
  return (
    <>
      <ComboBox
        filter="Contains"
        placeholder={
          loadingSystems
            ? getI18nText("systemSelect.loadingSystemData")
            : getI18nText("systemSelect.placeholder")
        }
        loading={loadingSystems}
      >
        {haveSystems &&
          aSystems.map((row) => {
            let bSystemSelected = isSystemSelected(row._id);
            return (
              <ComboBoxItem
                key={row._id}
                text={
                  bSystemSelected
                    ? formatterSystemNameSelected(row.name)
                    : row.name
                }
              />
            );
          })}
      </ComboBox>
    </>
  );
}
