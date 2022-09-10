import { useCallback, useEffect } from "react";
import { useTranslations } from "../../translations/i18nContext";

export default function Main(props) {
  const { getI18nText } = useTranslations();

  useEffect(() => {
    document.title = getI18nText("app.title");
  }, []);
  return <p>Main</p>;
}
