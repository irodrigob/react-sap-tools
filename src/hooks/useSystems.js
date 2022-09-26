import { useCallback, useState, useMemo, useEffect } from "react";
import { useSession } from "auth/authProvider";
import { useLazyQuery, gql } from "@apollo/client";
import { firstBy } from "thenby";
import { errorHandling } from "utils/graphQL/errorHandling";
import { showToast, MESSAGE } from "utils/general/message";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";

export const MAIN_SYSTEMS_FIELDS = gql`
  fragment MainSystemsFields on Systems {
    _id
    user
    name
    host
    sap_user
    sap_password
  }
`;

export const QUERY_USER_SYSTEMS = gql`
  query Query($user: String!) {
    getSystemsByUser(user: $user) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export const MUTATION_NEW_SYSTEM = gql`
  mutation Mutation($input: InputSystems) {
    newSystem(input: $input) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export const MUTATION_UPDATE_SYSTEM = gql`
  mutation Mutation($id: String!, $input: InputSystems) {
    updateSystem(id: $id, input: $input) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export const MUTATION_DELETE_SYSTEM = gql`
  mutation Mutation($id: String!) {
    deleteSystem(id: $id) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export default function useSystems() {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { systemSelected, setSystemsList, systemsList, setSystemSelected } =
    useGlobalData();

  /*************************************
   * Funciones
   ************************************/

  /**
   * Función que guarda los sistema en el contexto global.
   * Ordeno los registros por nombre para tenerlos ordenarlos y no tener que hacerlo
   * en la capa de presentación
   * @param aSystems | Array con los sistemas
   */
  const saveSystems = useCallback((aSystems) => {
    if (Array.isArray(aSystems)) {
      let systemsSave = [...aSystems];
      systemsSave = systemsSave.sort(firstBy("name"));
      setSystemsList(systemsSave);
      //setSystemsReaded(true);
    }
  }, []);

  /**
   * Devuelve si el sistema pasado esta seleccionado
   * @param sIDSystem | ID del sistema
   * @returns Booleano
   */
  const isSystemSelected = useCallback(
    (sIDSystem) => {
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
   * Valida si la URL es valida
   * @param pURL | URL
   * @returns Booleano
   */
  const validateHost = useCallback((pURL) => {
    if (pURL.match(/(^http[s]?:\/{2})|(^\/{1,2})/g) == null) return false;
    else return true;
  }, []);

  /**
   * Formatea la URL
   * @param pURL | URL
   * @returns URL formateada
   */
  const formatterHost = useCallback((pURL) => {
    // Si en el host tenemos el / como carácter final lo elimino.
    if (pURL.match(/(\/$)/g)) pURL = pURL.slice(0, -1);

    return pURL;
  }, []);

  /**
   * Formatea el path
   * @param pURL | URL
   * @returns URL formateada
   */
  const formatterPath = useCallback((pPath) => {
    // Si el path no tiene / al final se lo añado.
    if (!pPath.match(/(\/$)/g)) pPath = pPath.concat("/");

    // Si el path no tiene el / al principio se lo pongo
    if (!pPath.match(/(^\/)/g)) pPath = `/${pPath}`;

    return pPath;
  }, []);

  /**
   * Función que añade un sistema al modelo de datos
   * @param sSystem | Estructura con los datos del sistema
   */
  const addSystem = useCallback(
    (sSystem) => {
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
    (sSystem) => {
      let aSystemsAux = [...systemsList];
      let index = aSystemsAux.findIndex((row) => row._id == sSystem._id);
      aSystemsAux[index] = sSystem;
      // Ordeno el array para que quede igual de ordenado como cuando se graban los datos
      // por primera vez
      aSystemsAux = aSystemsAux.sort(firstBy("name"));
      setSystemsList(aSystemsAux);

      // Ahora miro si el sistema seleccionado es el mismo que el modificado. Si es así, le cambio el nombre
      if (sSystem._id == systemSelected._id) setSystemSelected(sSystem);
    },
    [systemsList, systemSelected]
  );

  /**
   * Función que borra un sistema al modelo de datos
   * @param pID | Id del registro a borrar
   */
  const deleteSystem = useCallback(
    (pID) => {
      let aSystemsAux = [...systemsList];

      let index = aSystemsAux.findIndex((row) => row._id == pID);
      aSystemsAux.splice(index, index >= 0 ? 1 : 0);

      setSystemsList(aSystemsAux);

      // El sistema marcado por defecto lo dejo en blanco.
      setSystemSelected("");

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
    //router.push("/");
  }, []);

  /**
   * Proceso de selección de sistemas. El sistema que viene por parámetro
   * puede venir el ID o la estructura del sistema. El motivo es que se llama
   * desde dos sitios a la vez y en cada uno de ellos hay datos de distintos
   * @param sSystem | Sistema seleccionado
   */
  const processSelectedSystem = useCallback((pSystem) => {}, []);

  /*************************************
   * Servicios GraphQL
   ************************************/

  const [srvGetUserSystems, { loading: loadingSystems }] = useLazyQuery(
    QUERY_USER_SYSTEMS,
    {
      variables: {
        user: session?.email,
      },
      onCompleted: (data) => {
        saveSystems(data.getSystemsByUser);
      },

      onError: (error) => {
        // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
        let responseError = errorHandling(error);
        showToast(
          getI18nText("systemSelect.errorCallServiceRead", {
            errorService: responseError.singleMessage,
          }),
          MESSAGE.TYPE.ERROR
        );
      },
    }
  );

  return {
    loadingSystems,
    srvGetUserSystems,
    isSystemSelected,
    validateHost,
    formatterHost,
    formatterPath,
    addSystem,
    session,
    updateSystem,
    deleteSystem,
  };
}
