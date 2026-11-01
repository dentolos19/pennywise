import lessons from "@/data/lessons.json";
import items from "@/data/shop.json";

export function lessonReward(id: unknown, answers: unknown) {
  const lesson = lessons.find((item) => item.id === id);
  if (
    !lesson ||
    !Array.isArray(answers) ||
    answers.length !== lesson.questions.length ||
    !lesson.questions.every((question, index) => answers[index] === question.answerIndex)
  ) {
    throw new Error("Invalid lesson answers.");
  }
  return lesson.points;
}

export function itemCost(name: unknown) {
  const item = items.find((entry) => entry.name === name);
  if (!item) throw new Error("Item not found.");
  return item.points;
}
