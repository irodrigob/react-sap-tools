import React, { useState, createContext, useContext, FC } from "react";
import System from "systems/domain/entities/system";
import TunnelConfiguration from "ngrokTunnel/domain/entities/configuration";
type systemsType = System[];

export const DEFAULT_SYSTEM = new System("", "", "", "", "", "");
export const DEFAULT_TUNNEL_CONF = new TunnelConfiguration("", "", "", "");

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
  tunnelConfiguration: TunnelConfiguration;
  setTunnelConfiguration: (value: TunnelConfiguration) => void;
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
  tunnelConfiguration: DEFAULT_TUNNEL_CONF,
  setTunnelConfiguration: (value: TunnelConfiguration) => {},
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
  const [tunnelConfiguration, setTunnelConfiguration] =
    useState<TunnelConfiguration>(DEFAULT_TUNNEL_CONF);
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
        tunnelConfiguration,
        setTunnelConfiguration,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export default SystemProvider;
export const useSystemData = () => useContext(SystemContext);
