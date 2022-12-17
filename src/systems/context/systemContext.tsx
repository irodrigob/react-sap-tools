import React, { useState, createContext, useContext, FC } from "react";
import System from "systems/domain/entities/system";

type systemsType = System[];

const DEFAULT_SYSTEM = new System("", "", "", "", "", "");

interface systemContextInterface {
  systemsList: systemsType;
  setSystemsList: (value: systemsType) => void;
  systemSelected: System;
  setSystemSelected: (value: System) => void;
  systemsReaded: boolean;
  setSystemsReaded: (value: boolean) => void;
  connectedToSystem: boolean;
  setConnectedToSystem: (value: boolean) => void;
  showListApps: boolean;
  setShowListApps: (value: boolean) => void;
  loadingListApps: boolean;
  setLoadingListApps: (value: boolean) => void;
}

const SystemContext = createContext<systemContextInterface>({
  systemsList: [],
  setSystemsList: (value: systemsType) => {},
  systemSelected: DEFAULT_SYSTEM,
  setSystemSelected: (value: System) => {},
  systemsReaded: false,
  setSystemsReaded: (value: boolean) => {},
  connectedToSystem: false,
  setConnectedToSystem: (value: boolean) => {},
  showListApps: false,
  setShowListApps: (value: boolean) => {},
  loadingListApps: false,
  setLoadingListApps: (value: boolean) => {},
});

interface Props {
  children: React.ReactNode;
}

const SystemProvider: FC<Props> = (props) => {
  /*************************************
   * Variables
   ************************************/

  const { children } = props;
  const [systemsList, setSystemsList] = useState<systemsType>([]);
  const [systemSelected, setSystemSelected] = useState(DEFAULT_SYSTEM);
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
        setSystemsList,
        systemSelected,
        setSystemSelected,
        systemsReaded,
        setSystemsReaded,
        connectedToSystem,
        setConnectedToSystem,
        showListApps,
        setShowListApps,
        loadingListApps,
        setLoadingListApps,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export default SystemProvider;
export const useSystemData = () => useContext(SystemContext);
