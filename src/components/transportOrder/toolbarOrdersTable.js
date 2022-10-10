import { useSelector, useDispatch } from "react-redux";
import {
  FilterBar,
  FilterGroupItem,
  MultiComboBox,
  MultiComboBoxItem,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/filter";
import { useTranslations } from "translations/i18nContext";
import useFilterValues from "components/transportOrder/useFilterValues";
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";

export default function ToolbarOrdersTable(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();
  const { filterTypeValues } = useFilterValues();
  const { toolbarFilters } = useSelector((state) => state.SAPTransportOrder);

  const onTypeSelectionChange = (e) => {
    let newFilterValues = { ...toolbarFilters };
    newFilterValues = { type: e.detail.items.map((item) => item.id) };
    dispatch(toolbarFiltersAction(newFilterValues));
  };

  return (
    <FilterBar hideToolbar={false} style={{ marginBottom: "0.4rem" }}>
      <FilterGroupItem
        active
        label={getI18nText("transportOrder.filters.type.label")}
        required
      >
        <MultiComboBox onSelectionChange={onTypeSelectionChange}>
          {filterTypeValues.map((row) => {
            return (
              <MultiComboBoxItem
                text={row.text}
                selected={row.defaultSelected}
                key={row.code}
                id={row.code}
              />
            );
          })}
        </MultiComboBox>
      </FilterGroupItem>
    </FilterBar>
  );
}
