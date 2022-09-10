import { useRef, useState } from "react";
import { Popover } from "@ui5/webcomponents-react";
import { Avatar } from "@ui5/webcomponents-react";
import { useSession } from "../../../auth/authProvider";
import MenuProfile from "./menuProfile";

export default function UserAvatar(props) {
  const menuProfileRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const { session } = useSession();
  return (
    <>
      <Avatar
        shape="Circle"
        size="XS"
        interactive={true}
        id="userAvatar"
        onClick={(e) => {
          setOpenMenu(true);
        }}
      >
        <img src={session.picture} referrerPolicy="no-referrer" />
      </Avatar>
      <Popover
        opener="userAvatar"
        open={openMenu}
        onAfterClose={() => {
          setOpenMenu(false);
        }}
      >
        <MenuProfile />
      </Popover>
    </>
  );
}
