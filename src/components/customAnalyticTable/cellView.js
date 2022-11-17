import { useMemo } from "react";
import {
  FlexBox,
  Label,
  Button,
  Icon,
  Input,
  CheckBox,
} from "@ui5/webcomponents-react";
import { INTERNAL_FIELDS_DATA, COMPONENT_TYPE } from "./constants";

export default function CellView(props) {
  const { instance } = props;
  const { cell, row } = instance;
  const componentType =
    props.componentType == undefined ? "" : props.componentType;

  // El ancho del input es la longitud de la columna - 20 para que quepa mejor en la celda.
  const inputWidth = useMemo(() => {
    return cell.column.originalWidth - 40;
  }, [cell.column.originalWidth]);

  const ComponentTypeObject = () => {
    const { instance, componentType } = props;
    const { cell, row } = instance;
    switch (componentType) {
      case COMPONENT_TYPE.CHECKBOX:
        return <CheckBox checked={cell.value} disabled={true} />;
      default:
        return <Label>{cell.value}</Label>;
    }
  };

  return <ComponentTypeObject />;
}
