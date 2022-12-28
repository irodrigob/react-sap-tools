import { FC } from "react";
import { ValueState, FlexBox, Button } from "@ui5/webcomponents-react";
import IconInteractive from "shared/components/iconInteractive";

interface Props {}

const CellAction: FC<Props> = (instance: any) => {
  console.log(instance);
  return (
    <FlexBox>
      <p>h</p>
    </FlexBox>
  );
};

export default CellAction;
