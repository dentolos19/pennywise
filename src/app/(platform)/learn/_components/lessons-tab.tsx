import { Box } from "@mui/material";

import LessonItem from "@/app/(platform)/learn/_components/lesson-item";
import lessons from "@/data/lessons.json";

export default function LessonsTab() {
  return (
    <Box className={"grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"}>
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          id={lesson.id}
          name={lesson.name}
          description={lesson.description}
          points={lesson.points}
          imageUrl={lesson.imageUrl}
        />
      ))}
    </Box>
  );
}
