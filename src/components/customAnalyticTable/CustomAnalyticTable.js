import { useState, useEffect } from "react";
import { AnalyticalTable } from "@ui5/webcomponents-react";
import DialogMessages from "./dialogMessages";
import { AnalyticalTableHooks } from "@ui5/webcomponents-react";
import DialogConfirmDeleteRow from "./dialogConfirmDeleteRow";
import useCustomAnalyticTable from "./useCustomAnalyticTable";
import { useTranslations } from "translations/i18nContext";

/**
 * Props que tiene campos a medida y que se informan en props propias del componente UI5:
 * columns:
 * --> edit: Booleano indica si es editable o no.
 * --> required: Booleano para indicar si el campo es obligatorio
 * Props exclusivas del componente a medidas:
 * --> allowEdit: Booleano permite a nivel global si la tabla es editable.Si no se informa por defecto es true.
 * --> allowDelete: Booleano permite a nivel global si se pueden borrar registros.Si no se informa por defecto es true.
 * --> editable: Objeto JSON donde se informan las funciones que se ejecutarán en el proceso de edición. El objeto tendrá los siguientes campos:
 * ----> onRowUpdate: Se le pasara una función que se ejecutara cuando una fila se edite. La función deberá devolver un promise. El reject de la promise
 * se enviará un texto con el error producido. Los parámetros de la función son:
 * newData ->JSON con la fila de datos modificada
 * oldData --> JSON con los datos originales de la fila
 * ----> onRowDelete: Se le pasara una función que se ejecutara cuando una fila se borre. La función deberá devolver un promise. El reject de la promise
 * se enviará un texto con el error producido. Los parámetros de la función son: oldData --> JSON con los datos originales de la fila
 * ----> onRowValidation: Se le pasará la función donde permitirá validar los de la celda modifica. Los parámetros de entrada son:
 * newData -> Datos de la fila modificada
 * column -> Nombre de la columna
 * value -> Valor de la celda
 * La función deberá devolver un array con la siguiente estructura JSON:
 * column -> Columna donde aplicará el estado y mensaje. Si esta en blanco aplica a la fila entera. Si no se informa el campo se tomará como
 * base la columna donde se ha modificado el valor
 * value --> Nuevo valor de la columna, si esta se indica. Si no se informa el campo no se hará ningún cambio
 * validations --> Array con los mensajes y su tipo generado. La estructura es la siguiente:
 ** state: -> Estado de la validación. Los valores posibles son: "None","Warning","Error","Success","Information"
 ** message -> Texto libre
 */
export default function CustomAnalyticTable(props) {
  const {
    columns,
    data,
    editable: propsEditable,
    withRowHighlight,
    allowDelete, // Para evitar el warning en la consola, aunque no lo use directamente aquí
    ...others
  } = props;
  const {
    fieldCatalog,
    buildFieldCatalog,
    setData,
    tableValues,
    setTableProperties,
    openPopupMessages,
    actionCloseShowMessagesRow,
    rowMessages,
    openPopupConfirmDelete,
    actionConfirmDeleteRow,
    actionCancelDeleteRow,
    actionCloseConfirmDeleteRow,
    setPropsEditable,
  } = useCustomAnalyticTable();
  const [showRowHighLight, setShowRowHighLight] = useState();

  /*************************************
   * Efectos
   ************************************/

  /**
   * Efecto que se lanza cuando cambian las propiedas de la tabla, campos o datos. En el se construye el catalogo de campos y adapta los valores cada vez que se pasan
   * nuevos valores o nuevo catalogo de campos
   */
  useEffect(() => {
    setPropsEditable(propsEditable); // Props para la edición
    const tableProps = setTableProperties(props); // Propiedades globales
    const valuesProps = setData(columns, data, tableProps); // Adaptacion de los valores
    buildFieldCatalog(columns, valuesProps, propsEditable, tableProps); // Catalogo de campos

    setShowRowHighLight(valuesProps.showRowHighLight);
  }, [data, columns]);

  return (
    <>
      <AnalyticalTable
        columns={fieldCatalog}
        data={tableValues}
        withRowHighlight={showRowHighLight}
        {...others}
      />
      <DialogMessages
        open={openPopupMessages}
        onClose={() => {
          actionCloseShowMessagesRow();
        }}
        messages={rowMessages}
      />
      <DialogConfirmDeleteRow
        open={openPopupConfirmDelete}
        onClose={actionCloseConfirmDeleteRow}
      />
    </>
  );
}
