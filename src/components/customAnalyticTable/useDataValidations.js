import { useCallback } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import {
  COLUMN_PROPERTIES,
  INTERNAL_FIELDS_DATA,
  DEFAULT_ROW_VALIDATIONS,
} from "./constants";
import { useTranslations } from "translations/i18nContext";

export default function useDataValidations() {
  const { getI18nText } = useTranslations();
  /**
   * Proceso que realiza las validaciones a nivel de celda tanto internas del componente como propias
   * indicadas a nivel de columna.
   * @param {object} instance
   * @param {string} cellValue
   * @returns Objeto con el resultado de la validación
   */
  const cellValidations = useCallback((instance, cellValue) => {
    let cellValidation = {
      ...DEFAULT_ROW_VALIDATIONS,
      column: instance.cell.column.id,
    };

    /*
    La estructura de error que tiene que devolver las funciones que se llaman son muy simple:
    {
      state:"" --> Un valor de las constante del componente ValueState
      message:"" --> Campos string
    }
    */
    let validationReturn = { state: "", message: "" };

    if (instance.cell.column.required)
      validationReturn = fieldMandatory(instance, cellValue);

    if (
      validationReturn.state === "" ||
      validationReturn.state === ValueState.None
    ) {
      // Siguientes validaciones
    } else {
      cellValidation.state = validationReturn.state;
      cellValidation.message = validationReturn.message;
    }

    return cellValidation;
  }, []);

  const fieldMandatory = useCallback((instance, cellValue) => {
    if (cellValue == "") {
      return {
        state: ValueState.Error,
        message: getI18nText(
          "customAnalyticTable.localization.validations.fieldMandatory"
        ),
      };
    }
  }, []);

  return { cellValidations };
}
