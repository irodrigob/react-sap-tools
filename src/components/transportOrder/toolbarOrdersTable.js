import { useSelector, useDispatch } from "react-redux";
import {
  FilterBar,
  FilterGroupItem,
  MultiComboBox,
  MultiComboBoxItem,
  Panel,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/filter";
import { useTranslations } from "translations/i18nContext";
import useFilterValues from "components/transportOrder/useFilterValues";
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";

export default function ToolbarOrdersTable(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();
  const {} = useFilterValues();
  const { toolbarFilters } = useSelector((state) => state.SAPTransportOrder);

  const onFilterChange = (e) => {
    let newFilterValues = { ...toolbarFilters };

    newFilterValues[e.target.id] = newFilterValues[e.target.id].map((row) => {
      if (e.detail.items.find((item) => item.id == row.code))
        return { ...row, defaultSelected: true };
      else return { ...row, defaultSelected: false };
    });
    dispatch(toolbarFiltersAction(newFilterValues));
  };

  return (
    <FilterBar hideToolbar={false} style={{ marginBottom: "0.4rem" }}>
      <FilterGroupItem
        active
        label={getI18nText("transportOrder.filters.type.labelOrder")}
        required
      >
        <MultiComboBox onSelectionChange={onFilterChange} id="orderTypes">
          {toolbarFilters.orderTypes.map((row) => {
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
      <FilterGroupItem
        active
        label={getI18nText("transportOrder.filters.status.labelOrder")}
        required
      >
        <MultiComboBox onSelectionChange={onFilterChange} id="orderStatus">
          {toolbarFilters.orderStatus.map((row) => {
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
