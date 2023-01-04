import { styled } from "@mui/material/styles";
import { Icon } from "@ui5/webcomponents-react";

export const IconDropDownStyled = styled(Icon)({
  color: "var(--_ui5_input_icon_color)",
  cursor: "pointer",
  outline: "none",
  padding: "var(--_ui5_input_icon_padding)",
  borderInlineStart: "var(--_ui5_input_icon_border)",
  minWidth: "1rem",
  minHeight: "1rem",
  "&:hover": {
    borderInlineStart: "var(--_ui5_select_hover_icon_left_border)",    
    background: "var(--_ui5_input_icon_hover_bg)",
    boxShadow: "var(--_ui5_input_icon_box_shadow)",
  },
  "&:active": {
    backgroundColor: "var(--sapButton_Active_Background)",
    boxShadow: "var(--_ui5_input_icon_box_shadow)",
    borderInlineStart: "var(--_ui5_select_hover_icon_left_border)",
    color: "var(--_ui5_input_icon_pressed_color)",
  },
});
