import React, { useState, createContext, useContext } from "react";

// Aquí se crea el contexto. Que se se declará en el fichero ráiz "_app.js" para que los datos sean globales
const SAPTransportOrderContext = createContext({});

export function SAPTransportOrderProvider({ children }) {
  /*************************************
   * Variables
   ************************************/

  // Listado de sistemas a los que se puede transportar
  const [systemsTransport, setSstemsTransport] = useState([]);
  // URL de conexión para el transporte de ordenes
  const [URLOData, setURLOData] = useState("");

  /*************************************
   * Funciones
   ************************************/

  /*************************************
   * Efectos
   ************************************/

  return (
    <SAPTransportOrderContext.Provider
      value={{
        systemsTransport,
        setSstemsTransport,
        URLOData,
        setURLOData,
      }}
    >
      {children}
    </SAPTransportOrderContext.Provider>
  );
}

export const useSAPTransportOrderData = () =>
  useContext(SAPTransportOrderContext);
