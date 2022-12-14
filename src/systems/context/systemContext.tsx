import React, {
  useState,
  createContext,  
  useContext,  
  FC
} from "react";
import System from "systems/domain/entities/system";

type systemsType=System[]

interface systemContextInterface {
 
  systemsList: systemsType|null;
  setSystemsList?:(value:System[]|undefined)=>void;
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
const SystemContext = createContext<Partial<systemContextInterface>>({});

interface Props {
  children: React.ReactNode;
}


const SystemProvider:FC<Props>=(props)=> {
  /*************************************
   * Variables
   ************************************/

  const {children}=props
  const [systemsList, setSystemsList] = useState<systemsType>();
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
//
  return (
    <SystemContext.Provider
      value={{
        systemsList,        
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
    </SystemContext.Provider>
  );
}

export default SystemProvider
export const useSystemData = () => useContext(SystemContext);
