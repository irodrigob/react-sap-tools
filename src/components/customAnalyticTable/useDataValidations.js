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
      value:"" --> Valor introducido del campo que puede ser modificado.
      validations:[]--> Array que tendrá la siguiente estructura:
            {
              state:"" --> Un valor de las constante del componente ValueState
              message:"" --> String para el mensaje
            }
    }

   */
  const rowValidations = useCallback(
    (instance, cellValue, customCellValidation) => {
      let rowValidations = [
        {
          ...DEFAULT_ROW_MESSAGE,
          column: instance.cell.column.id,
          value: cellValue,
        },
      ];

      // La validación de campo obligatoria devolverá una estructura plana simple
      if (instance.cell.column.required === true) {
        let resultFieldMandatory = fieldMandatory(instance, cellValue);
        if (resultFieldMandatory)
          rowValidations[0].validations = [resultFieldMandatory];
      }

      if (
        rowValidations[0].validations.length == 0 ||
        rowValidations[0].validations.findIndex(
          (row) => row.state == ValueState.None
        ) != -1
      ) {
        // Siguientes validaciones
        if (typeof customCellValidation === "function") {
          let validationsCustomReturn = customCellValidation(
            convertFieldsInternalRow2External(instance.row.original),
            instance.cell.column.id,
            cellValue
          );
          if (
            Array.isArray(validationsCustomReturn) &&
            validationsCustomReturn.length > 0
          ) {
            validationsCustomReturn.forEach((row) => {
              let index = rowValidations.findIndex(
                (rowValidation) => rowValidation.column == row.column
              );

              let newValidations =
                row.validations != undefined
                  ? row.validations.map((validation) => {
                      return {
                        state: validation?.state
                          ? validation?.state
                          : ValueState.None,
                        message: validation?.message ? validation.message : "",
                      };
                    })
                  : [];

              let newColumn = row?.column
                ? row.column
                : instance.cell.column.id;

              if (index == -1) {
                rowValidations.push({
                  column: newColumn,
                  value:
                    row.value != undefined
                      ? row.value
                      : instance.row.original[newColumn],
                  validations: newValidations,
                });
              } else {
                if (row.value != undefined)
                  rowValidations[index].value = row.value;

                rowValidations[index].validations =
                  rowValidations[index].validations.concat(newValidations);
              }
            });
          }
        }
      }

      return rowValidations;
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
    //else return DEFAULT_SINGLE_VALIDATION;
  }, []);

  return { rowValidations };
}
