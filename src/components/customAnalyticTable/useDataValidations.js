import { useCallback } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import {
  COLUMN_PROPERTIES,
  INTERNAL_FIELDS_DATA,
  DEFAULT_ROW_MESSAGE,
  DEFAULT_SINGLE_VALIDATION,
} from "./constants";
import { useTranslations } from "translations/i18nContext";
import { convertFieldsInternalRow2External } from "./commonsUtils";

export default function useDataValidations() {
  const { getI18nText } = useTranslations();

  /**
   * Proceso que realiza las validaciones y cambios de valor a nivel de fila tanto internas del componente como propias
   * indicadas a nivel de columna.
   * @param {object} instance
   * @param {string} cellValue
   * @returns Array con los objetos con el resultado de la validación. El array tendrá la siguiente estructura:
   * {
      column:"" --> Columna con el mensaje. Por defecto siempre vendrá la columna donde se modifica el campo
      state:"" --> Un valor de las constante del componente ValueState
      message:"" --> String para el mensaje
      value:"" --> Valor introducido del campo que puede ser modificado.
    }

   */
  const rowValidations = useCallback(
    (instance, cellValue, customCellValidation) => {
      let rowValidations = [];
      let cellBaseValidation = {
        column: instance.cell.column.id,
        value: cellValue,
      };

      let cellValidation = {
        ...DEFAULT_ROW_MESSAGE,
        column: instance.cell.column.id,
        value: cellValue,
      };

      // La validación de campo obligatoria devolverá una estructura plana simple
      if (instance.cell.column.required === true) {
        rowValidations.push({
          ...fieldMandatory(instance, cellValue),
          ...cellBaseValidation,
        });
      }

      if (
        rowValidations.findIndex((row) => row.state == ValueState.None) != -1
      ) {
        // Siguientes validaciones
        if (typeof customCellValidation === "function") {
          let validationsCustomReturn = customCellValidation(
            convertFieldsInternalRow2External(instance.row.original),
            instance.cell.column.id,
            cellValue
          );
          let arrayCustomReturn = validationsCustomReturn.map((row) => {
            return {
              state: row?.state ? row?.state : ValueState.None,
              message: row?.message ? row.message : "",
              column: row?.column ? row.colum : instance.cell.column.id,
              value: row?.value
                ? row.value
                : instance.row.original[instance.cell.column.id],
            };
          });
          rowValidations = rowValidations.concat(arrayCustomReturn);
          /*cellValidation.state = validationCustomReturn?.state
            ? validationCustomReturn?.state
            : ValueState.None;
          cellValidation.message = validationCustomReturn?.message
            ? validationCustomReturn.message
            : "";*/
        }
      }

      console.log(rowValidations);
      return cellValidation;
    },
    []
  );

  const fieldMandatory = useCallback((instance, cellValue) => {
    if (cellValue == "")
      return {
        state: ValueState.Error,
        message: getI18nText(
          "customAnalyticTable.localization.validations.fieldMandatory"
        ),
      };
    else return DEFAULT_SINGLE_VALIDATION;
  }, []);

  return { rowValidations };
}
