import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actionIconLoader,
  actionShowLoader,
  actionTextLoader,
} from "reduxStore/generalActions";

// Aquí se crea el contexto. Que se se declará en el fichero ráiz "_app.js" para que los datos sean globales
const GlobalContext = createContext({});

export function GlobalProvider({ children }) {
  /*************************************
   * Variables
   ************************************/

  // Listado de sistema del usuario
  const [systemsList, setSystemsList] = useState([]);
  const [systemSelected, setSystemSelected] = useState({});
  const [systemsReaded, setSystemsReaded] = useState(false);
  const [connectedToSystem, setConnectedToSystem] = useState(false);
  const [showListApps, setShowListApps] = useState(false);
  /*************************************
   * Funciones
   ************************************/

  /**
   * Devuelve los sistemas del usuario
   */
  const getUserSystems = useCallback(() => {
    return systemsList;
  }, [systemsList]);

  /*************************************
   * Efectos
   ************************************/

  return (
    <GlobalContext.Provider
      value={{
        getUserSystems,
        systemsList,
        setSystemSelected,
        systemSelected,
        systemsReaded,
        setSystemsReaded,
        connectedToSystem,
        setConnectedToSystem,
        setSystemsList,
        showListApps,
        setShowListApps,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalData = () => useContext(GlobalContext);
