import { lessonsService } from "@service";
import GroupLessons from "./lessons";
import { useEffect, useState } from "react";

const GroupPage = () => {
  const [lessons, setLessons] = useState([]);
  const params = { page: 1, limit: 100 };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await lessonsService.getLessons(params) as any;
        setLessons(response || []);
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Group Lessons</h1>
      <GroupLessons lessons={lessons} />
    </div>
  );
};

export default GroupPage;
