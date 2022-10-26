import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "translations/i18nContext";
import { TYPE, STATUS } from "utils/sap/transportOrder";
import date from "date-and-time";
import { toolbarFiltersStateAction } from "reduxStore/sapTransportOrderSlice";
//import { formatDate, getPreviousDay } from "utils/general/dates";

export default function useFilterValues(props) {
  const dispatch = useDispatch();

  const { toolbarFiltersState } = useSelector(
    (state) => state.SAPTransportOrder
  );
  const { getI18nText } = useTranslations();

  /**
   * Devuelve los valores
   * @param filtersValues | Valores de los filtros
   * @returns | Filtros por defecto para la barra de filtros de la tabla de ordenes
   */
  const getDefaultFilters = useCallback(() => {
    // Tipos
    let types = [
      {
        code: TYPE.WORKBENCH,
        text: getI18nText("transportOrder.filters.type.values.workbench"),
        selected: true,
      },
      {
        code: TYPE.CUSTOMIZING,
        text: getI18nText("transportOrder.filters.type.values.customizing"),
        selected: true,
      },
      {
        code: TYPE.TRANSPORT_COPIES,
        text: getI18nText("transportOrder.filters.type.values.transportCopies"),
        selected: false,
      },
    ];

    // Status
    let status = [
      {
        code: STATUS.CHANGEABLE,
        text: getI18nText("transportOrder.filters.status.values.changeable"),
        selected: true,
      },
      {
        code: STATUS.RELEASED,
        text: getI18nText("transportOrder.filters.status.values.released"),
        selected: false,
      },
    ];

    // Fecha de liberación
    let previousDate = date.format(
      date.addMonths(new Date(), -1),
      "DD.MM.YYYY"
    );

    return {
      orderTypes: types,
      orderStatus: status,
      releaseDateFrom: previousDate,
    };
  }, []);
  /**
   * Convierte los filtros al formato de los servicios de graphql
   * @param filtersValues | Valores de los filtros
   * @returns | Objeto compatible con graphql
   */
  const convertFilter2paramsGraphql = useCallback((filtersValues) => {
    return {
      orderTypes: filtersValues.orderTypes
        .filter((row) => row.selected)
        .map((values) => {
          return { type: values.code };
        }),
      orderStatus: filtersValues.orderStatus
        .filter((row) => row.selected)
        .map((values) => {
          return { status: values.code };
        }),

      releaseDateFrom: [
        date.transform(
          filtersValues.releaseDateFrom,
          "DD.MM.YYYY",
          "YYYY-MM-DD"
        ),
        "00:00:00",
      ].join("T"),
    };
  }, []);

  /**
   * Chequeo los valores de los multicombo
   * @param {Array} comboValues
   * @param {string} comboId
   */
  const checkFilterCombo = useCallback((comboValues, comboId) => {
    let newFiltersValueState = { ...toolbarFiltersState };
    let fieldDesc = comboId + "Desc";
    if (comboValues.findIndex((row) => row.selected) != -1) {
      newFiltersValueState[comboId] = ValueState.None;
      newFiltersValueState[fieldDesc] = "";
    } else {
      newFiltersValueState[comboId] = ValueState.Error;
      newFiltersValueState[fieldDesc] = getI18nText(
        "transportOrder.filters.validations.fieldMandatory"
      );
    }
    dispatch(toolbarFiltersStateAction(newFiltersValueState));
  }, []);

  /**
   * Verifica la fecha de liberación
   * @param {string} value
   */
  const checkReleaseDate = useCallback((value) => {
    let newFiltersValueState = { ...toolbarFiltersState };

    if (value.length == 0) {
      newFiltersValueState.releaseDate = ValueState.Error;
      newFiltersValueState.releaseDateDesc = getI18nText(
        "transportOrder.filters.validations.fieldMandatory"
      );
    } else {
      newFiltersValueState.releaseDate = ValueState.None;
      newFiltersValueState.releaseDateDesc = "";
    }
    dispatch(toolbarFiltersStateAction(newFiltersValueState));
  }, []);

  return {
    getDefaultFilters,
    convertFilter2paramsGraphql,
    checkFilterCombo,
    checkReleaseDate,
  };
}
