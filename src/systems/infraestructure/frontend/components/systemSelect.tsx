import { useCallback, useState, useEffect } from "react";
import "@ui5/webcomponents-icons/dist/account";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import { Input, SuggestionItem, Popover } from "@ui5/webcomponents-react";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContextTS";
import { useGlobalData } from "context/globalDataContext";
import { SystemController } from "systems/infraestructure/controller/SystemController";

export default function SystemSelect(){
    const { getI18nText } = useTranslations();
    //const { systemsList, systemSelected } = useGlobalData();
    
    return <p></p>
}