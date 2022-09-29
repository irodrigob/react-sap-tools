import React, { useState, createContext, useContext, useEffect } from "react";
import { useGlobalData } from "context/globalDataContext";
//import useMessageManager from "components/messageManager/useMessageManager";
import { CSS } from "utils/sap/constans";

// Aquí se crea el contexto. Que se se declará en el fichero ráiz "_app.js" para que los datos sean globales
const SAPContext = createContext({});

export function SAPProvider({ children }) {
  /*************************************
   * Variables
   ************************************/
  const {
    systemSelected,
    systemURL2Connect,
    setSystemSAPURL2Connect,
    connectedtoSystem,
    setConnectedtoSystem,
  } = useGlobalData();
  //const { thereMessages } = useMessageManager();
  // Datos del usuario de conexión
  const [userInfo, setUserInfo] = useState({});
  // Listado de aplicaciones
  const [appsList, setAppsList] = useState([]);
  // URL de conexión para el transporte de ordenes
  const [URLODataCore, setURLODataCore] = useState("");

  /*************************************
   * Funciones
   ************************************/

  /*************************************
   * Efectos
   ************************************/

  // El retorno es la etiqueta que se pondría en el JSX pero al hacer aquí queda más limpio cuando se pinta la página
  return (
    <SAPContext.Provider
      value={{
        userInfo,
        setUserInfo,
        appsList,
        setAppsList,
        URLODataCore,
        setURLODataCore,
      }}
    >
      {children}
    </SAPContext.Provider>
  );
}

export const useSAPGlobalData = () => useContext(SAPContext);
