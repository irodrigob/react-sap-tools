import { FC } from "react";
import System from "systems/domain/entities/system";
import { SuggestionItem } from "@ui5/webcomponents-react";

interface Props {
  systemsList: System[];
}

/*
 bSystemSelected
            ? formatterSystemNameSelected(row.name)
            : row.name
*/

const SuggestionSystemList: FC<Props> = (props) => {
  const { systemsList } = props;
  return (
    <>
      {systemsList.map((row) => {
        //let bSystemSelected = isSystemSelected(row._id);
        return <SuggestionItem id={row._id} key={row._id} text={row.name} />;
      })}
    </>
  );
};

export default SuggestionSystemList;
