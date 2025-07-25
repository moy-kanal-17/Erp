import type { GroupLessonType } from "../../types";
import LessonsList from "../lessons/lessons-list";
const GroupLessons = ({ lessons }: GroupLessonType) => {
	return (
		<>
			<LessonsList lessons={lessons} />
		</>
	);
};

export default GroupLessons;