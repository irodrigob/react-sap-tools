import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "translations/i18nContext";
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";
import { TYPE } from "utils/sap/transportOrder";

export default function useFilterValues(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();

  const [filterTypeValues] = useState([
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
  ]);

  return { filterTypeValues };
}
