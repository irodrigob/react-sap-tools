import { useTranslations } from "translations/i18nContext";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  Button,
  Bar,
  Form,
  FormItem,
  Input,
} from "@ui5/webcomponents-react";
import TextField from "@mui/material/TextField";
import { orderTaskSelectedAction } from "reduxStore/sapTransportOrderSlice";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";

const FooterDialog = (props) => {
  const { onCloseButton, onConfirmButton } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={props.slot}
      design="Footer"
      startContent={
        <Button style={{ marginTop: "1rem" }} onClick={onConfirmButton}>
          {getI18nText("transportOrder.transportCopy.popup.btnConfirm")}
        </Button>
      }
      endContent={
        <Button style={{ marginTop: "1rem" }} onClick={onCloseButton}>
          {getI18nText("general.btnTxtCancel")}
        </Button>
      }
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    />
  );
};

export default function PopupTransCopy(props) {
  const { open, onCloseButton, onConfirmButton } = props;
  const { getI18nText } = useTranslations();
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm();
  const { orderTaskSelected } = useSelector((state) => state.SAPTransportOrder);

  /*************************************
   * Funciones
   ************************************/
  const onSubmitForm = (data) => {};
  /*
 <TextField
                required
                label={getI18nText("systems.labelName")}
                variant="filled"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                sx={{
                  width: "15em",
                  fontFamily: "var(--sapFontFamily)",
                  fontSize: "var(--sapFontSize)",
                }}
              />
*/

  return (
    <Dialog
      open={open}
      headerText={getI18nText("editSystem.titleAddSystem")}
      footer={
        <FooterDialog
          onCloseButton={() => {
            reset();
            onCloseButton();
          }}
          onConfirmButton={handleSubmit(onSubmitForm)}
        />
      }
    >
      <Form
        style={{
          alignItems: "center",
        }}
      >
        <FormItem>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                required
                onChange={onChange}
                value={value}
                valueState={error?.message.length > 0 ? "Error" : "None"}
                valueStateMessage={
                  error?.message.length > 0 ? error.message : ""
                }
              />
            )}
            rules={{ required: getI18nText("general.fieldMandatory") }}
          />
        </FormItem>
      </Form>
    </Dialog>
  );
}
