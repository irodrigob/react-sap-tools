import React, {
  useState,
  createContext,  
  useContext,
  
  FC
} from "react";
import System from "systems/domain/entities/system";

interface globalContextInterface {
  systemsList: object[];
  setSystemsList:(value:System[])=>void;
  systemSelected: object;
  setSystemSelected:(value:object)=>void;
  systemsReaded:boolean;
  setSystemsReaded:(value:boolean)=>void;
  connectedToSystem:boolean;
  setConnectedToSystem:(value:boolean)=>void;
  showListApps:boolean;
  setShowListApps:(value:boolean)=>void;
  loadingListApps:boolean;
  setLoadingListApps:(value:boolean)=>void;
}

// Aquí se crea el contexto. Que se se declará en el fichero ráiz "_app.js" para que los datos sean globales
const GlobalContext = createContext<Partial<globalContextInterface>>({});

interface Props {
  children: React.ReactNode;
}


const GlobalProvider:FC<Props>=(props)=> {
  /*************************************
   * Variables
   ************************************/

  const {children}=props
  const [systemsList, setSystemsList] = useState<System[]>();
  const [systemSelected, setSystemSelected] = useState({});
  const [systemsReaded, setSystemsReaded] = useState(false);
  const [connectedToSystem, setConnectedToSystem] = useState(false);
  const [showListApps, setShowListApps] = useState(false);
  const [loadingListApps, setLoadingListApps] = useState(false);
  /*************************************
   * Funciones
   ************************************/

  /*************************************
   * Efectos
   ************************************/

  return (
    <GlobalContext.Provider
      value={{
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
        loadingListApps,
        setLoadingListApps,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider
export const useGlobalData = () => useContext(GlobalContext);
