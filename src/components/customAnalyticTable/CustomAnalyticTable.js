import { useState, useEffect } from "react";
import {
  AnalyticalTable,
  FlexBox,
  Input,
  Label,
} from "@ui5/webcomponents-react";
import { AnalyticalTableHooks } from "@ui5/webcomponents-react";
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
 * ----> onRowUpdate: Se le pasara la función que se ejecutara cuando una fila se edite. La función deberá devolver un promise. El reject de la promise
 * se enviará un texto con el error producido.
 * ----> onRowDelete: Se le pasara la función que se ejecutara cuando una fila se borre. La función deberá devolver un promise. El reject de la promise
 * se enviará un texto con el error producido.
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
    const tableProps = setTableProperties(props); // Propiedades globales
    const valuesProps = setData(columns, data, tableProps); // Adaptacion de los valores
    buildFieldCatalog(columns, valuesProps, propsEditable); // Catalogo de campos

    setShowRowHighLight(valuesProps.showRowHighLight);
  }, [data, columns, props]);

  return (
    <AnalyticalTable
      columns={fieldCatalog}
      data={tableValues}
      withRowHighlight={showRowHighLight}
      {...others}
    />
  );
}
