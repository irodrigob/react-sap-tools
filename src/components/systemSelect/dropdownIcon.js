import { IconStyled } from "./systemSelectCSS";
import "@ui5/webcomponents-icons/dist/slim-arrow-down";
import "@ui5/webcomponents-icons/dist/slim-arrow-up";

export default function DropdownIcon(props) {
  const { onClick, openSystemList } = props;
  return (
    <IconStyled
      name={openSystemList ? "slim-arrow-up" : "slim-arrow-down"}
      slot={props.slot}
      onClick={onClick}
    />
  );
}
