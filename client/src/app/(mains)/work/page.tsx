import { ArchivmentList } from "./components/ArchivmentList/ArchivmentList";
import { GameBanner } from "./components/GameBanner/GameBanner";

export default function Work() {
  return (
    <div className="container">
      <GameBanner />
      <ArchivmentList />
    </div>
  );
}
