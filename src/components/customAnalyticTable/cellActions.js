import { useRef, useState } from "react";
import { FlexBox, ResponsivePopover, Label } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/edit";
import "@ui5/webcomponents-icons/dist/delete";
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/decline";
import "@ui5/webcomponents-icons/dist/alert";
import "@ui5/webcomponents-icons/dist/upload-to-cloud";
import IconInteractive from "components/general/iconInteractive/iconInteractive";
import { INTERNAL_FIELDS_DATA, COLUMN_PROPERTIES } from "./constants";
import { useTranslations } from "translations/i18nContext";

export default function CellActions(props) {
  const {
    instance,
    onClickEdit,
    onClickDecline,
    onClickAccept,
    onClickShowMessages,
    onClickDelete,
  } = props;
  const { row } = instance;
  const { getI18nText } = useTranslations();

  return (
    <FlexBox>
      {!row.original[INTERNAL_FIELDS_DATA.EDITING] && (
        <span style={{ marginRight: "0.5rem" }}>
          {typeof instance.cell.column[COLUMN_PROPERTIES.CELL_ORIGINAL_ACTIONS]
            .Cell === "function" &&
            instance.cell.column[COLUMN_PROPERTIES.CELL_ORIGINAL_ACTIONS].Cell(
              instance
            )}
        </span>
      )}

      {row.original[INTERNAL_FIELDS_DATA.EDITABLE] &&
        !row.original[INTERNAL_FIELDS_DATA.EDITING] && (
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
        !row.original[INTERNAL_FIELDS_DATA.EDITING] && (
          <IconInteractive
            name="delete"
            onClick={onClickDelete}
            style={{ marginLeft: "0.5rem" }}
            showTooltip={true}
            accessibleName={getI18nText(
              "customAnalyticTable.localization.editRow.deleteTooltip"
            )}
          />
        )}
      {INTERNAL_FIELDS_DATA.EDITING in row.original &&
        row.original[INTERNAL_FIELDS_DATA.EDITING] && (
          <IconInteractive
            name="accept"
            onClick={onClickAccept}
            showTooltip={true}
            accessibleName={getI18nText(
              "customAnalyticTable.localization.editRow.confirmTooltip"
            )}
          />
        )}
      {INTERNAL_FIELDS_DATA.EDITING in row.original &&
        row.original[INTERNAL_FIELDS_DATA.EDITING] && (
          <IconInteractive
            name="decline"
            onClick={onClickDecline}
            style={{ marginLeft: "0.5rem" }}
            showTooltip={true}
            accessibleName={getI18nText(
              "customAnalyticTable.localization.editRow.cancelTooltip"
            )}
          />
        )}

      {INTERNAL_FIELDS_DATA.MESSAGES in row.original &&
        row.original[INTERNAL_FIELDS_DATA.MESSAGES].length > 0 && (
          <IconInteractive
            name="alert"
            onClick={onClickShowMessages}
            style={{ marginLeft: "0.5rem" }}
            showTooltip={true}
            accessibleName={getI18nText(
              "customAnalyticTable.localization.editRow.messagesTooltip"
            )}
          />
        )}
    </FlexBox>
  );
}
