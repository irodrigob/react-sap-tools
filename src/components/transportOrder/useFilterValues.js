import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "translations/i18nContext";
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";
import { TYPE, STATUS } from "utils/sap/transportOrder";

export default function useFilterValues(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();

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

    return { types: types, status: status };
  }, []);

  return { getDefaultFilters };
}
