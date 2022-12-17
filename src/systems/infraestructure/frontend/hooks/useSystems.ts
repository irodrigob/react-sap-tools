import { useCallback } from "react";
import System from "systems/domain/entities/system";
import { useSystemData } from "systems/context/systemContext";

export default function useSystems() {
  const { setSystemSelected, systemSelected } = useSystemData();
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

  return { processSelectedSystem, isSystemSelected };
}
