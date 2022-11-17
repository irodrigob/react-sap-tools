import { useMemo } from "react";
import {
  FlexBox,
  Label,
  Button,
  Icon,
  Input,
  CheckBox,
} from "@ui5/webcomponents-react";
import { INTERNAL_FIELDS_DATA } from "./constants";

export default function CellEdit(props) {
  const { instance, onChange, required,columnType } = props;
  const { cell, row } = instance;

  const fieldCellValueState = useMemo(() => {
    return `${INTERNAL_FIELDS_DATA.PREFIX_VALUE_STATE}${instance.cell.column.id}`;
  }, []);
  const fieldCellValueStateMessage = useMemo(() => {
    return `${INTERNAL_FIELDS_DATA.PREFIX_VALUE_STATE_MESSAGE}${instance.cell.column.id}`;
  }, []);

  // El ancho del input es la longitud de la columna - 20 para que quepa mejor en la celda.
  const inputWidth = useMemo(() => {
    return cell.column.originalWidth - 40;
  }, [cell.column.originalWidth]);

  return (
    <>
      {!row.original[INTERNAL_FIELDS_DATA.EDITING] && (
        <Label>{cell.value}</Label>
      )}
      {row.original[INTERNAL_FIELDS_DATA.EDITING] && (
        <Input
          value={cell.value}
          required={required}
          valueState={instance.row.original[fieldCellValueState]}
          valueStateMessage={<Label>{fieldCellValueStateMessage}</Label>}
          onChange={(e) => {
            onChange(instance, e.target.value);
          }}
          style={{ minWidth: `${inputWidth}px` }}
          type={props.type}
        />
      )}
    </>
  );
}
