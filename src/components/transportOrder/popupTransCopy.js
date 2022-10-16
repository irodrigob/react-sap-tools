import { useTranslations } from "translations/i18nContext";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Button, Bar, Form, FormItem } from "@ui5/webcomponents-react";
import { orderTaskSelectedAction } from "reduxStore/sapTransportOrderSlice";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";

export default function PopupTransCopy(props) {
  const { onCloseButton, onConfirmButton } = props;
  const { getI18nText } = useTranslations();
  const dispatch = useDispatch();
  const { orderTaskSelected } = useSelector((state) => state.SAPTransportOrder);
}
