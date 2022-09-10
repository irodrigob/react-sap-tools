import { FlexBox } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/edit";
import "@ui5/webcomponents-icons/dist/delete";
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/decline";
import IconInteractive from "components/general/iconInteractive/iconInteractive";
import { INTERNAL_FIELDS_DATA } from "./constants";
import { useTranslations } from "translations/i18nContext";

export default function CellActions(props) {
  const { instance, onClickEdit, onClickDecline, onClickAccept } = props;
  const { cell, row } = instance;
  const { getI18nText } = useTranslations();

  return (
    <FlexBox>
      {row.original[INTERNAL_FIELDS_DATA.EDITABLE] &&
        !row.original[INTERNAL_FIELDS_DATA.ROW_EDITING] && (
          <IconInteractive
            name="edit"
            onClick={onClickEdit}
            showTooltip={true}
            accessibleName={getI18nText(
              "customAnalyticTable.localization.editRow.editTooltip"
            )}
          />
        )}
      {row.original[INTERNAL_FIELDS_DATA.DELETABLE] &&
        !row.original[INTERNAL_FIELDS_DATA.ROW_EDITING] && (
          <IconInteractive
            name="delete"
            onClick={() => {}}
            style={{ marginLeft: "1rem" }}
            showTooltip={true}
            accessibleName={getI18nText(
              "customAnalyticTable.localization.editRow.deleteTooltip"
            )}
          />
        )}
      {row.original[INTERNAL_FIELDS_DATA.ROW_EDITING] && (
        <IconInteractive
          name="accept"
          onClick={onClickAccept}
          showTooltip={true}
          accessibleName={getI18nText(
            "customAnalyticTable.localization.editRow.confirmTooltip"
          )}
        />
      )}
      {row.original[INTERNAL_FIELDS_DATA.ROW_EDITING] && (
        <IconInteractive
          name="decline"
          onClick={onClickDecline}
          style={{ marginLeft: "1rem" }}
          showTooltip={true}
          accessibleName={getI18nText(
            "customAnalyticTable.localization.editRow.cancelTooltip"
          )}
        />
      )}
    </FlexBox>
  );
}
