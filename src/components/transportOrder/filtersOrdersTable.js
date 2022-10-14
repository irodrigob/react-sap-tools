import { useSelector, useDispatch } from "react-redux";
import {
  FilterBar,
  FilterGroupItem,
  MultiComboBox,
  MultiComboBoxItem,
  DatePicker,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/filter";
import { useTranslations } from "translations/i18nContext";
import useFilterValues from "components/transportOrder/useFilterValues";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";
import { STATUS } from "utils/sap/transportOrder";
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";

export default function FiltersOrdersTable(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();
  const { getDefaultFilters } = useFilterValues();
  const { toolbarFilters } = useSelector((state) => state.SAPTransportOrder);
  const { reloadUserOrders } = useSAPTransportOrder();

  const onFilterChange = (e) => {
    let newFilterValues = { ...toolbarFilters };

    newFilterValues[e.target.id] = newFilterValues[e.target.id].map((row) => {
      if (e.detail.items.find((item) => item.id == row.code))
        return { ...row, selected: true };
      else return { ...row, selected: false };
    });
    dispatch(toolbarFiltersAction(newFilterValues));
  };

  return (
    <FilterBar
      hideToolbar={true}
      style={{ marginBottom: "0.4rem" }}
      showGoOnFB
      showRestoreOnFB
      hideFilterConfiguration={false}
      onGo={(e) => {
        reloadUserOrders();
      }}
      onRestore={() => {
        dispatch(toolbarFiltersAction(getDefaultFilters()));
      }}
    >
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
                selected={row.selected}
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
                selected={row.selected}
                key={row.code}
                id={row.code}
              />
            );
          })}
        </MultiComboBox>
      </FilterGroupItem>
      {toolbarFilters.orderStatus.find(
        (row) => row.code == STATUS.RELEASED && row.selected == true
      ) && (
        <FilterGroupItem
          active
          label={getI18nText("transportOrder.filters.releaseDate.label")}
          required
        >
          <DatePicker
            hideWeekNumbers={true}
            formatPattern="dd.MM.yyyy"
            onChange={(e) => {
              let newFilterValues = {
                ...toolbarFilters,
                releaseDateFrom: e.detail.value,
              };
              dispatch(toolbarFiltersAction(newFilterValues));
            }}
            value={toolbarFilters.releaseDateFrom}
          />
        </FilterGroupItem>
      )}
    </FilterBar>
  );
}
