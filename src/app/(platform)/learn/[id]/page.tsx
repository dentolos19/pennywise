"use client";

import { Box, Button, Card, CardActionArea, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { completeLessonAction } from "@/app/(platform)/learn/actions";
import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import LoadingView from "@/components/views/loading-view";
import NotFoundView from "@/components/views/not-found-view";
import { timeout } from "@/lib/utils";

type Lesson = {
  id: string;
  name: string;
  description: string;
  points: number;
  questions: {
    statement: string;
    choices: string[];
    answerIndex: number;
  }[];
};

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"start" | "questions" | "end">("start");
  const [lesson, setLesson] = useState<Lesson>();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [rewardStatus, setRewardStatus] = useState<"pending" | "awarded" | "failed">("pending");
  const answering = useRef(false);

  useEffect(() => {
    fetch(`/api/lessons?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data as Lesson);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingView />;
  if (!lesson) return <NotFoundView />;

  const createAnswerHandler = (choiceIndex: number) => {
    return () => {
      if (answering.current) return;
      answering.current = true;
      const isCorrect = choiceIndex === lesson.questions[questionIndex].answerIndex;
      const submittedAnswers = [...answers, choiceIndex];
      setAnswers(submittedAnswers);
      if (isCorrect) setCorrectAnswers((prev) => prev + 1);
      setShowAnswers(true);
      timeout(1000).then(() => {
        answering.current = false;
        setShowAnswers(false);
        if (questionIndex === lesson.questions.length - 1) {
          setPhase("end");
          if (correctAnswers + Number(isCorrect) !== lesson.questions.length) return;
          if (!auth.user) {
            setRewardStatus("failed");
            return;
          }
          completeLessonAction(lesson.id, submittedAnswers)
            .then(() => {
              setRewardStatus("awarded");
              toast.show({
                message: `You have earned ${lesson.points} points!`,
                severity: "info",
              });
              void auth.refresh();
            })
            .catch(() => setRewardStatus("failed"));
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      });
    };
  };

  const handleComplete = () => {
    router.push("/app");
  };

  const handleReset = () => {
    setPhase("start");
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setAnswers([]);
    answering.current = false;
    setRewardStatus("pending");
  };

  if (phase === "start")
    return (
      <Box className={"grid h-full place-items-center"}>
        <Paper className={"w-[90%] p-8 md:w-[80%] lg:w-[60%] xl:w-[40%]"} variant={"outlined"}>
          <Box className={"flex flex-col gap-4 text-center"}>
            <Box>
              <Typography className={"text-4xl font-bold"} gutterBottom>
                {lesson.name}
              </Typography>
              <Typography color={"textSecondary"}>{lesson.description}</Typography>
              <Chip className={"mt-4"} label={`${lesson.points} points`} />
            </Box>
            <Button variant={"contained"} color={"primary"} onClick={() => setPhase("questions")}>
              Begin
            </Button>
          </Box>
        </Paper>
      </Box>
    );

  if (phase === "end" && correctAnswers === lesson.questions.length)
    return (
      <Box className={"grid h-full place-items-center"}>
        <Paper className={"w-[90%] p-8 md:w-[80%] lg:w-[60%] xl:w-[40%]"} variant={"outlined"}>
          <Box className={"flex flex-col gap-4 text-center"}>
            <Typography className={"text-4xl font-bold"} gutterBottom>
              You've passed!
            </Typography>
            <Typography color={"textSecondary"}>
              {rewardStatus === "awarded"
                ? `Congratulations! You have earned ${lesson.points} points!`
                : rewardStatus === "failed"
                  ? "Unable to add points. Please try again."
                  : "Adding your points..."}
            </Typography>
            {rewardStatus === "failed" && (
              <Button variant={"outlined"} onClick={handleReset}>
                Try Again
              </Button>
            )}
            <Button variant={"contained"} color={"primary"} onClick={handleComplete}>
              Home
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  else if (phase === "end")
    return (
      <Box className={"grid h-full place-items-center"}>
        <Paper className={"w-[90%] p-8 md:w-[80%] lg:w-[60%] xl:w-[40%]"} variant={"outlined"}>
          <Box className={"flex flex-col gap-4 text-center"}>
            <Box>
              <Typography className={"text-4xl font-bold"} gutterBottom>
                You've failed!
              </Typography>
              <Typography color={"textSecondary"}>Keep going! You can always try again.</Typography>
            </Box>
            <Button variant={"contained"} color={"primary"} onClick={handleReset}>
              Try Again
            </Button>
            <Button LinkComponent={Link} variant={"contained"} color={"secondary"} href={"/app"}>
              Home
            </Button>
          </Box>
        </Paper>
      </Box>
    );

  if (phase === "questions")
    return (
      <Box className={"grid h-full place-items-center"}>
        <Paper className={"w-[90%] p-8 md:w-[80%] lg:w-[60%] xl:w-[40%]"} variant={"outlined"}>
          <Box className={"flex flex-col gap-4"}>
            <Typography className={"text-center text-2xl font-bold"}>
              {lesson.questions[questionIndex].statement}
            </Typography>
            <Box className={"flex flex-col gap-2"}>
              {lesson.questions[questionIndex].choices.map((choice, index) => (
                <Card key={index}>
                  <CardActionArea className={"p-4"} disabled={showAnswers} onClick={createAnswerHandler(index)}>
                    <Typography
                      color={
                        showAnswers
                          ? index === lesson.questions[questionIndex].answerIndex
                            ? "success"
                            : "error"
                          : "textPrimary"
                      }
                    >
                      {choice}
                    </Typography>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    );
}
