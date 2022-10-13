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
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";
import { STATUS } from "utils/sap/transportOrder";

export default function ToolbarOrdersTable(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();
  const {} = useFilterValues();
  const { toolbarFilters } = useSelector((state) => state.SAPTransportOrder);

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
