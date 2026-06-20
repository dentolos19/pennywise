import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import Link from "next/link";

export default function LessonItem(props: {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  points: number;
}) {
  return (
    <Card className={"flex flex-col"}>
      <CardMedia className={"h-[150px]"} image={props.imageUrl} />
      <CardContent className={"flex-1"}>
        <Typography className={"text-2xl"} gutterBottom>
          {props.name}
        </Typography>
        <Typography color={"textSecondary"}>{props.description}</Typography>
      </CardContent>
      <CardActions>
        <Button LinkComponent={Link} href={`/learn/${props.id}`}>
          Start
        </Button>
        <Chip label={`${props.points} points`} />
      </CardActions>
    </Card>
  );
}
