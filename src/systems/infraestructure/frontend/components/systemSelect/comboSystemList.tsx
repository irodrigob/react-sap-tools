import { FC } from "react";
import {
  Popover,
  List,
  StandardListItem,
  Bar,
  Button,
} from "@ui5/webcomponents-react";
import System from "systems/domain/entities/system";

interface Props {
  opener: string;
  open: boolean;
  onAfterClose: () => void;
  systemList: System[];
  handlerSystemSelected: (systemSelected: System) => void;
}

const ComboSystemList: FC<Props> = (props) => {
  const { onAfterClose, open, opener, handlerSystemSelected } = props;

  return (
    <Popover
      opener={opener}
      open={open}
      placementType="Bottom"
      onAfterClose={onAfterClose}
    >
      <p>Hola</p>
    </Popover>
  );
};

export default ComboSystemList;
