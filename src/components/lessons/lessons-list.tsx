import { Tooltip } from "antd";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { LessonType } from "../../types/sections";
import LessonInfo from "./lesson-info-modal";
import LessonModal from "./lesson-modal";

const getStylesByStatus = (status: string) => {
  const s = status.toLowerCase();

  const base =
    "flex-shrink-0 w-14 h-14 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform relative overflow-hidden text-center";

  switch (s) {
    case "cancelled":
    case "bekor qilingan":
      return {
        container: `${base} bg-red-100 border-red-300 text-red-800 hover:shadow-red-200 hover:scale-105 hover:-translate-y-1`,
        dot: "bg-red-500",
        tooltipColor: "#E80A15",
        tooltipText: "#fff",
      };
    case "completed":
    case "tugagan":
      return {
        container: `${base} bg-green-100 border-green-300 text-green-800 hover:shadow-green-200 hover:scale-105 hover:-translate-y-1`,
        dot: "bg-green-500",
        tooltipColor: "#00C851",
        tooltipText: "#fff",
      };
    case "in_progress":
      return {
        container: `${base} bg-yellow-100 border-yellow-300 text-yellow-800 hover:shadow-yellow-200 hover:scale-105 hover:-translate-y-1`,
        dot: "bg-yellow-500",
        tooltipColor: "#FFBB33",
        tooltipText: "#000",
      };
    case "new":
    case "yangi":
      return {
        container: `${base} bg-gray-100 border-gray-300 text-gray-800 hover:shadow-gray-200 hover:scale-105 hover:-translate-y-1`,
        dot: "bg-gray-500",
        tooltipColor: "#ccc",
        tooltipText: "#000",
      };
    default:
      return {
        container: `${base} bg-white border-gray-200 text-gray-800 hover:shadow-md hover:scale-105 hover:-translate-y-1`,
        dot: "bg-gray-400",
        tooltipColor: "#ccc",
        tooltipText: "#000",
      };
  }
};

const LessonsList = ({ lessons }: { lessons: LessonType[] }) => {
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [update, setUpdate] = useState<LessonType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const go = (val: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: val * 200, behavior: "smooth" });
    }
  };

  const isStartDisabled = () => !containerRef.current || scrollPosition <= 5;

  const isEndDisabled = () =>
    !containerRef.current ||
    scrollPosition + containerRef.current.clientWidth >=
      containerRef.current.scrollWidth - 3;

  const updateItem = (lessonData: LessonType) => {
    setOpen(true);
    setUpdate(lessonData);
  };

  const toggle = () => {
    setOpen((prev) => !prev);
    if (update) setUpdate(null);
  };

  const handleClickInfo = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setOpenInfo(true);
  };

  const toggleInfo = () => {
    setOpenInfo(false);
    setSelectedLesson(null);
  };

  const formatDayAndMonth = (date: string) => {
    const newDate = date.split("T")[0];
    const [_, month, day] = newDate.split("-");
    return `${day}.${month}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Lessons</h2>
              <p className="text-sm font-medium text-gray-900">Group lessons</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4 text-gray-900 text-sm font-medium w-fit">
            <span>All: <strong>{lessons.length}</strong></span>
            <span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
                Completed
              </span>: {
                lessons.filter(l => ["completed", "tugagan"].includes(l.status.toLowerCase())).length
              }
            </span>
            <span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">
                Canceled
              </span>: {
                lessons.filter(l => ["cancelled", "bekor qilingan"].includes(l.status.toLowerCase())).length
              }
            </span>
            <span>
              <span className="px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-semibold">
                In Progress
              </span>: {
                lessons.filter(l => l.status.toLowerCase() === "in_progress").length
              }
            </span>
            <span>
              <span className="green">
                New
              </span>: {
                lessons.filter(l => ["new", "yangi"].includes(l.status.toLowerCase())).length
              }
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            disabled={isStartDisabled()}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 disabled:from-gray-50 disabled:to-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 group-disabled:text-gray-400" />
          </button>

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-2 p-[10px]">
              {lessons.map((lesson, index) => {
                const styles = getStylesByStatus(lesson.status);
                const dateInfo = formatDayAndMonth(lesson.date);
                return (
                  <div
                    key={lesson.id || index}
                    onClick={() => handleClickInfo(lesson)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      updateItem(lesson);
                    }}
                    className={styles.container}
                  >
                    <Tooltip
                      title={lesson.notes}
                      color={styles.tooltipColor}
                      overlayInnerStyle={{ color: styles.tooltipText }}
                    >
                      <div className="text-center">
                        <div className="text-[14px] font-bold">{dateInfo.split(".")[0]}</div>
                        <div className="text-[10px] font-medium opacity-90">{dateInfo.split(".")[1]}</div>
                      </div>
                      <div className="absolute top-1 right-1 size-3">
                        <div className={`w-3 h-3 rounded-full ${styles.dot} opacity-80`} />
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => go(1)}
            disabled={isEndDisabled()}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 disabled:from-gray-50 disabled:to-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 group-disabled:text-gray-400" />
          </button>
        </div>
      </div>

      {open && <LessonModal open={open} toggle={toggle} update={update} />}
      {openInfo && <LessonInfo open={openInfo} toggle={toggleInfo} lesson={selectedLesson} />}
    </div>
  );
};

export default LessonsList;
