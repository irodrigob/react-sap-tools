import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "translations/i18nContext";
import { TYPE, STATUS } from "utils/sap/transportOrder";

export default function useFilterValues(props) {
  const dispatch = useDispatch();
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
        defaultSelected: true,
      },
      {
        code: TYPE.CUSTOMIZING,
        text: getI18nText("transportOrder.filters.type.values.customizing"),
        defaultSelected: true,
      },
      {
        code: TYPE.TRANSPORT_COPIES,
        text: getI18nText("transportOrder.filters.type.values.transportCopies"),
        defaultSelected: false,
      },
    ];

    // Status
    let status = [
      {
        code: STATUS.CHANGEABLE,
        text: getI18nText("transportOrder.filters.status.values.changeable"),
        defaultSelected: true,
      },
      {
        code: STATUS.RELEASED,
        text: getI18nText("transportOrder.filters.status.values.released"),
        defaultSelected: false,
      },
    ];

    return {
      orderTypes: types,
      orderStatus: status,
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
        .filter((row) => row.defaultSelected)
        .map((values) => {
          return { type: values.code };
        }),
      orderStatus: filtersValues.orderStatus
        .filter((row) => row.defaultSelected)
        .map((values) => {
          return { status: values.code };
        }),
    };
  }, []);

  return { getDefaultFilters, convertFilter2paramsGraphql };
}
