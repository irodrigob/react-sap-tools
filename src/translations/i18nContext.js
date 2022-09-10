import i18n from "i18next";
import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";

//import common from "translations/resources/es/common.json";
//import { extractObjectPath } from "translations/utils";

// Aquí se crea el contexto. Que se se declará en el fichero ráiz "_app.js" para que los datos sean globales
const TranslationContext = React.createContext({});

// Esta función servirá para poder usar el Provider del context en las páginas.
// El {children} se pone para que se propage los datos o props del componente.
export function I18nProvider({ children }) {
  /*************************************
   * Variables
   ************************************/
  // Por defecto el idioma es español
  const [sLanguage, setLanguage] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("es");
  const { t } = useTranslation();

  /*************************************
   * Efectos
   ************************************/

  /*************************************
   * Funciones
   ************************************/
  /**
   *
   * @param {string} sText | Identificar del texto
   * @param {object} variables | Objeto con las variables. Ejemplo: { what: 'i18next', how: 'great' }
   * En el archivo de traducción se pondría: "key": "{{what}} is {{how}}"
   * @returns {string} | Texto
   */
  const getI18nText = (sText, variables = {}) => {
    return t(sText, variables);
  };

  /**
   * Devuelve un objeto con las claves de la traducción
   */
  /** @type typeof es */
  //const tkeys = extractObjectPath({ ...common });

  // El retorno es la etiqueta que se pondría en el JSX pero al hacer aquí queda más limpio cuando se pinta la página
  return (
    <TranslationContext.Provider
      value={{ language: i18n.language, getI18nText, defaultLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslations = () => useContext(TranslationContext);

export default TranslationContext;
