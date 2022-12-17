import { FC } from "react";
import { useTranslations } from "translations/i18nContext";

interface Props {
  system: string;
}

const FormatterSystemNameSelected = (props: Props) => {
  const { system } = props;
  const { getI18nText } = useTranslations();

  return (
    <strong>
      {system + " " + getI18nText("systemSelect.sufixSystemSelected")}
    </strong>
  );
};

export default FormatterSystemNameSelected;
