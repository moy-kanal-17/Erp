import { Button } from "antd";
import type { GroupLessonsType, Lesson } from "../../types/lessons";
import { useRef, useState } from "react";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { lessonService } from "@service";
import { Notification } from "@helpers";
import LessonModal from "./lessonModal";

const GroupLessons = ({ lessons }: GroupLessonsType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(
    null
  );

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setModalOpen(true);
  };

  const goNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const deleteLesson = (id: number) => {
    console.log(id);
    const res = lessonService.deleteLesson(id);
    if (!res) {
      console.log("hato!");
      Notification(
        "error",
        "Error Delete!",
        `Error in deleting lesson by id ${id}`
      );
      throw new Error("error!");
    }
  };

  const isStartDisabled = () => {
    if (!containerRef.current) return true;
    return scrollPosition <= 5;
  };

  const isEndDisabled = () => {
    if (!containerRef.current) return true;
    const container = containerRef.current;
    return scrollPosition + container.clientWidth >= container.scrollWidth - 5;
  };

  return (
    <div style={{ position: "relative", width: "1650px" }}>
      <div className="flex justify-between mb-5 p-5">
        <Button type="primary" onClick={goPrev} disabled={isStartDisabled()}>
          Prev
        </Button>

        <Button type="primary" onClick={goNext} disabled={isEndDisabled()}>
          Next
        </Button>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-x-auto whitespace-nowrap border p-2 rounded"
        style={{
          overflowX: "scroll",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {lessons.map((lesson, index) => (
          <div
            style={{ display: "inline-block", width: "300px" }}
            key={lesson.id}
            className="inline-block w-60 bg-gray-300 rounded-lg p-4 m-2"
          >
            <span className="block font-bold mb-1 bg-black">#{index + 1}</span>
            <div>
              <h1>
                {lesson.title || "No title"},id:{lesson.id}
              </h1>
              <p>{lesson.status || "status yoq"}</p>
              <p>Activite</p>
              <Button onClick={() => handleEdit(lesson)}>
                <EditFilled />
              </Button>

              <Button onClick={() => deleteLesson(lesson.id)}>
                <DeleteFilled />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <LessonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(updatedLesson) => {
          console.log("Edited lesson:", updatedLesson);
        }}
        initialData={editingLesson!}
      />
    </div>
  );
};

export default GroupLessons;
