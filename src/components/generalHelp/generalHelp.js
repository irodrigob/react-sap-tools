import { useState, useEffect } from "react";
import { Link, List, StandardListItem } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/sys-help";
import { Popover } from "@ui5/webcomponents-react";
import IconInteractive from "components/general/iconInteractive/iconInteractive";
import { useSAPGlobalData } from "context/sapDataContext";

const generalHelp = {
  appDesc: "General",
  urlHelp: "https://github.com/irodrigob/react-sap-tools",
};

export default function GeneralHelp() {
  const [open, setOpen] = useState(false);
  const { appsList } = useSAPGlobalData();
  const [listHelps, setListHelps] = useState([generalHelp]);

  useEffect(() => {
    if (Array.isArray(appsList) && appsList.length > 0) {
      let newlistHelps = [generalHelp];

      appsList.map((row) => {
        newlistHelps.push({
          appDesc: row.appDesc,
          urlHelp: row.urlHelp,
        });
      });
      setListHelps(newlistHelps);
    }
  }, [appsList]);

  return (
    <>
      <IconInteractive
        name="sys-help"
        id="generalHelp"
        style={{
          width: "2rem",
          height: "2rem",
          paddingLeft: "3rem",
          color: "var(--sapContent_Illustrative_Color2)",
        }}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Popover
        opener="generalHelp"
        open={open}
        placementType="Bottom"
        onAfterClose={() => {
          setOpen(false);
        }}
      >
        <List>
          {listHelps.map((row, index) => {
            return (
              <StandardListItem key={`K${index}`}>
                <Link
                  onClick={() => {
                    window.open(row.urlHelp, "_blank", "noopener,noreferrer");
                  }}
                  key={`L${index}`}
                >
                  {row.appDesc}
                </Link>
              </StandardListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
}
