
import { FC } from "react";

interface MiniSidebarProps {
  selectedView: string;
  setSelectedView: (view: "quests" | "streak") => void;
}

const MiniSidebar: FC<MiniSidebarProps> = ({ selectedView, setSelectedView }) => {
  return (
    <div className="w-24 bg-gray-900 p-2 flex flex-col items-center space-y-4">
      <button
        onClick={() => setSelectedView("quests")}
        className={`p-2 rounded-md text-white w-full ${selectedView === "quests" ? "bg-blue-500" : "hover:bg-gray-700"}`}
      >
        Quests
      </button>
      <button
        onClick={() => setSelectedView("streak")}
        className={`p-2 rounded-md text-white w-full ${selectedView === "streak" ? "bg-blue-500" : "hover:bg-gray-700"}`}
      >
        Streak
      </button>
    </div>
  );
};

export default MiniSidebar;
