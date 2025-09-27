import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiExpand } from "react-icons/bi";
import CommitHistory from "./ComitHistory";

const AnnouncementBoard = () => {
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  return (
    <>
      <div className="w-full relative p-0 md:px-0">
        <div
          className={`flex transition-all duration-300 relative bg-blue-50 rounded-md p-2 text-blue-950 text-md md:text-base border border-dashed border-blue-200 ${
            expand ? "p-4" : "pr-8"
          }`}
          onClick={() => setExpand(!expand)}
        >
          <p
            className={`${
              expand ? "flex flex-col gap-2" : "text-nowrap flex"
            } w-full transition-all  duration-300 `}
          >
            <b
              className={`${expand ? "font-bold text-lg italic pb-2" : "pr-2"}`}
            >
              {t("Announcement")} {!expand && ":"}
            </b>
            {expand && (
              <span className="mb-1 h-1 border-b border-dashed border-gray-400" />
            )}
            <p className="w-full overflow-hidden text-ellipsis leading-relaxed">
              <CommitHistory />
            </p>
          </p>
          <p
            className={`absolute ${
              expand ? "top-3" : "bottom-3"
            } right-2  text-gray-400 animate-pulse`}
          >
            <BiExpand />
          </p>
        </div>
      </div>
    </>
  );
};

export default AnnouncementBoard;
