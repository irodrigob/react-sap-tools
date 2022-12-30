import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import System from "systems/domain/entities/system";
import { useSystemData, DEFAULT_SYSTEM } from "systems/context/systemContext";
import { firstBy } from "thenby";

export default function useSystems() {
  const { setSystemSelected, systemSelected, systemsList, setSystemsList } =
    useSystemData();
  const navigate = useNavigate();
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

  /**
   * Función que actualiza un sistema al modelo de datos
   * @param sSystem | Estructura con los datos del sistema
   */
  const updateSystem = useCallback(
    (system: System) => {
      let aSystemsAux = [...systemsList];
      let index = aSystemsAux.findIndex((row) => row._id == system._id);
      aSystemsAux[index] = system;
      // Ordeno el array para que quede igual de ordenado como cuando se graban los datos
      // por primera vez
      aSystemsAux = aSystemsAux.sort(firstBy("name"));
      setSystemsList(aSystemsAux);

      // Ahora miro si el sistema seleccionado es el mismo que el modificado. Si es así, le cambio el nombre
      if (system._id == systemSelected._id) setSystemSelected(system);
    },
    [systemsList, systemSelected]
  );

  /**
   * Función que borra un sistema al modelo de datos
   * @param pID | Id del registro a borrar
   */
  const deleteSystem = useCallback(
    (pID: string) => {
      let aSystemsAux = [...systemsList];

      let index = aSystemsAux.findIndex((row) => row._id == pID);
      aSystemsAux.splice(index, index >= 0 ? 1 : 0);

      setSystemsList(aSystemsAux);

      // El sistema marcado por defecto lo dejo en blanco.
      setSystemSelected(DEFAULT_SYSTEM);

      // Acciones generales cuando se cambia o borra un sistema
      deleteSystemGeneralActions();
    },
    [systemsList]
  );

  /**
   * Acciones generales cuando se borra un sistema
   */
  const deleteSystemGeneralActions = useCallback(() => {
    // Limpiamos las variables del transporte de ordenes
    //clearVariablesSAPTransportOrder();
    // Vamos a la página de inicio
    navigate("/");
  }, []);

  return {
    processSelectedSystem,
    isSystemSelected,
    addSystem,
    updateSystem,
    deleteSystem,
  };
}
