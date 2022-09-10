import { useEffect, useMemo, useState, useId } from "react";
import {
  FlexBox,
  Label,
  Button,
  Icon,
  Input,
  ValueState,
  Popover,
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
  const [valueState, setValueState] = useState(ValueState.None);
  const [valueStateMessage, setValueStateMessage] = useState("");
  const [openValueState, setOpenValueState] = useState(false);
  const [inputID, setInputID] = useState("");
  const idUnique = useId();
  // El ancho del input es la longitud de la columna - 20 para que quepa mejor en la celda.
  const inputWidth = useMemo(() => {
    return cell.column.originalWidth - 40;
  }, [cell.column.originalWidth]);

  useEffect(() => {
    if (valueState === ValueState.None) setOpenValueState(false);
    else setOpenValueState(true);
  }, [valueState]);
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
      {!row.original[INTERNAL_FIELDS_DATA.ROW_EDITING] && (
        <Label>{cell.value}</Label>
      )}
      {row.original[INTERNAL_FIELDS_DATA.ROW_EDITING] && (
        <Input
          id={`${cell.column.id}_${idUnique}`}
          value={cell.value}
          required={required}
          valueState={valueState}
          valueStateMessage={<div>{valueStateMessage}</div>}
          onChange={(e) => {
            onChange(instance, e.target.value);
            setValueState(ValueState.Error);
            setValueStateMessage("campo obligatorio");
          }}
          style={{ minWidth: `${inputWidth}px` }}
        />
      )}
    </>
  );
}
