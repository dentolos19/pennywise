import LessonItem from "@/app/(main)/learn/_components/lesson-item";
import lessons from "@/data/lessons.json";
import { Box } from "@mui/material";

export default function LessonsTab() {
  return (
    <Box className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"}>
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
