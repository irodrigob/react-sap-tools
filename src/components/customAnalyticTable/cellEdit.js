import { useEffect, useMemo, useState, useId } from "react";
import {
  FlexBox,
  Label,
  Button,
  Icon,
  Input,
  ValueState,
} from "@ui5/webcomponents-react";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { INTERNAL_FIELDS_DATA } from "./constants";

const InputCustom = styled(TextField)({
  "& .MuiInputBase-input": {
    borderRadius: 0,
    padding: "4.5px 14px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "var(--_ui5_input_border_radius);",
  },
});

export default function CellEdit(props) {
  const { instance, onChange, required } = props;
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

  /*
           
<InputCustom
          value={cell.value}
          required={required}
          error={ValueState.Error ? true : false}
          helperText={valueStateMessage}
          onChange={(e) => {
            onChange(instance, e.target.value);
            setValueState(ValueState.Error);
            setValueStateMessage("campo obligatorio");
          }}
          size="small"
        />
  */
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
