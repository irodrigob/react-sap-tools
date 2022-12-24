import { useCallback } from "react";
import System from "systems/domain/entities/system";
import { useSystemData } from "systems/context/systemContext";
import { firstBy } from "thenby";

export default function useSystems() {
  const { setSystemSelected, systemSelected, systemsList, setSystemsList } =
    useSystemData();
  /**
   * Proceso que se lanza cuando se selecciona un sistema
   * @param(System) systemSelected - Sistema seleccionado
   */
  const processSelectedSystem = useCallback((systemSelected: System) => {
    setSystemSelected(systemSelected);
  }, []);

  /**
   * Devuelve si el sistema pasado esta seleccionado
   * @param sIDSystem - ID del sistema
   * @returns Booleano
   */
  const isSystemSelected = useCallback(
    (sIDSystem: string): boolean => {
      if (
        systemSelected &&
        systemSelected._id &&
        systemSelected._id == sIDSystem
      )
        return true;
      else return false;
    },
    [systemSelected]
  );

  /**
   * Función que añade un sistema al modelo de datos
   * @param sSystem | Estructura con los datos del sistema
   */
  const addSystem = useCallback(
    (sSystem: System) => {
      let aSystemsAux = [...systemsList];
      aSystemsAux.push(sSystem);
      // Ordeno el array para que quede igual de ordenado como cuando se graban los datos
      // por primera vez
      aSystemsAux = aSystemsAux.sort(firstBy("name"));
      setSystemsList(aSystemsAux);
    },
    [systemsList]
  );

  return { processSelectedSystem, isSystemSelected, addSystem };
}
