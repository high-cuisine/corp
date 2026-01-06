import Image from "next/image";
import { Invite } from "./components/invite/invite";
import FriendsList from "./components/friendsList/friendsList";

export default function Friends() {
  return (
    <div>
        <Invite></Invite>
        <FriendsList></FriendsList>
    </div>
  );
}
