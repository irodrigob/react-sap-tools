import { FilterBar, FilterGroupItem, Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/filter";
import { useTranslations } from "translations/i18nContext";

export default function ToolbarOrdersTable(props) {
  const { getI18nText } = useTranslations();

  return (
    <FilterBar hideToolbar={false}>
      <FilterGroupItem
        active
        label={getI18nText("transportOrder.filters.type")}
        required
      >
        <Button icon="filter" />
      </FilterGroupItem>
    </FilterBar>
  );
}
