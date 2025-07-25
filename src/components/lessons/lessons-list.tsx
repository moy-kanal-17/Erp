import { Tooltip } from "antd";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { LessonType } from "../../types/sections";
import LessonInfo from "./lesson-info-modal";
import LessonModal from "./lesson-modal";

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

    const isStartDisabled = () => {
        if (!containerRef.current) return true;
        return scrollPosition <= 5;
    };

    const isEndDisabled = () => {
        if (!containerRef.current) return true;
        return (
            scrollPosition + containerRef.current.clientWidth >=
            containerRef.current.scrollWidth - 3
        );
    };

    const updateItem = (lessonData: LessonType) => {
        setOpen(true);
        setUpdate(lessonData);
    };

    const toggle = () => {
        setOpen((prev) => !prev);
        if (update) {
            setUpdate(null);
        }
    };

    const handleClickInfo = (lesson: LessonType) => {
        setSelectedLesson(lesson);
        setOpenInfo(true);
    };

    const toggleInfo = () => {
        setOpenInfo(!openInfo);
        setSelectedLesson(null);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "bekor qilingan":
            case "cancelled":
                return "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-300";
            case "tugagan":
            case "completed":
                return "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-300";
            case "yangi":
            case "new":
                // Нейтральный серый для "новых", текст остается темным
                return "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 border-gray-300";
            case "in_progress":
                // Желтый/оранжевый для "в процессе", текст темный
                return "bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-300";
            default:
                // Дефолтный серый для неизвестных статусов
                return "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-gray-300";
        }
    };

    const formatDayAndMonth = (date: string) => {
        const newDate = date.split("T")[0];
        const [_, month, day] = newDate.split("-");
        return `${day}.${month}`;
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
            {/* Header */}
            {/* Вот здесь исправление: градиент для фона, текст остается черным/серым */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            {/* Текст теперь отдельно от фона, остается черным/серым */}
                            <h2 className="text-lg font-medium text-gray-900">Lessons</h2>
                            <p className="text-sm font-medium text-gray-900">Group lessons</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4 text-gray-900 text-sm font-medium w-fit">
                        <span>
                            All: <span className="font-bold">{lessons.length}</span>
                        </span>
                        <span>
                            <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
                                Completed
                            </span>
                            :
                            <span className="ml-1">
                                {
                                    lessons.filter(
                                        (lesson: LessonType) => lesson.status.toLowerCase() === "completed" || lesson.status.toLowerCase() === "tugagan"
                                    ).length
                                }
                            </span>
                        </span>
                        <span>
                            <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">
                                Canceled
                            </span>
                            :
                            <span className="ml-1">
                                {
                                    lessons.filter(
                                        (lesson: LessonType) => lesson.status.toLowerCase() === "cancelled" || lesson.status.toLowerCase() === "bekor qilingan"
                                    ).length
                                }
                            </span>
                        </span>
                        <span>
                            <span className="inline-block px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-semibold">
                                In Progress
                            </span>
                            :
                            <span className="ml-1">
                                {
                                    lessons.filter(
                                        (lesson: LessonType) => lesson.status.toLowerCase() === "in_progress"
                                    ).length
                                }
                            </span>
                        </span>
                        <span>
                            <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-semibold">
                                New
                            </span>
                            :
                            <span className="ml-1">
                                {
                                    lessons.filter(
                                        (lesson: LessonType) => lesson.status.toLowerCase() === "new" || lesson.status.toLowerCase() === "yangi"
                                    ).length
                                }
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative p-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => go(-1)}
                        disabled={isStartDisabled()}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 disabled:from-gray-50 disabled:to-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed group"
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
                            {lessons.map((lesson: LessonType, index: number) => {
                                const dateInfo = formatDayAndMonth(lesson.date);

                                return (
                                    <div
                                        key={lesson.id || index}
                                        onClick={() => handleClickInfo(lesson)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            updateItem(lesson);
                                        }}
                                        className={`${getStatusColor(lesson.status)}
                                            flex-shrink-0 w-14 h-14 p-4 rounded-xl border-2 cursor-pointer
                                            transition-all duration-300 hover:shadow-lg hover:scale-105
                                            transform hover:-translate-y-1 relative overflow-hidden`}
                                    >
                                        <Tooltip
                                            title={lesson?.notes}
                                            color={lesson.status.toLowerCase() === "cancelled" || lesson.status.toLowerCase() === "bekor qilingan" ? "#E80A15" : "#ccc"}
                                            overlayInnerStyle={
                                                (lesson.status.toLowerCase() === "cancelled" || lesson.status.toLowerCase() === "bekor qilingan")
                                                    ? { color: "#fff" }
                                                    : { color: "#000" }
                                            }
                                        >
                                            <div className="text-center">
                                                <div className="text-[14px] font-bold">
                                                    {dateInfo.split(".")[0]}
                                                </div>
                                                <div className="text-[10px] font-medium opacity-90">
                                                    {dateInfo.split(".")[1]}
                                                </div>
                                            </div>

                                            <div className="absolute top-1 right-1 size-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${
                                                        (lesson.status.toLowerCase() === "cancelled" || lesson.status.toLowerCase() === "bekor qilingan")
                                                            ? "bg-red-500"
                                                            : (lesson.status.toLowerCase() === "new" || lesson.status.toLowerCase() === "yangi")
                                                            ? "bg-gray-400"
                                                            : (lesson.status.toLowerCase() === "completed" || lesson.status.toLowerCase() === "tugagan")
                                                            ? "bg-green-500"
                                                            : lesson.status.toLowerCase() === "in_progress"
                                                            ? "bg-yellow-500"
                                                            : "bg-gray-400"
                                                    } opacity-80`}
                                                ></div>
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
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 disabled:from-gray-50 disabled:to-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed group"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 group-disabled:text-gray-400" />
                    </button>
                </div>
            </div>

            {open && <LessonModal open={open} toggle={toggle} update={update} />}

            {openInfo && (
                <LessonInfo
                    open={openInfo}
                    toggle={toggleInfo}
                    lesson={selectedLesson}
                />
            )}
        </div>
    );
};

export default LessonsList;