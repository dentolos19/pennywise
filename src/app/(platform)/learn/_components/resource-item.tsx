import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import Link from "next/link";

export default function ResourceItem(props: { name: string; description: string; url: string; imageUrl: string }) {
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
        <Button LinkComponent={Link} target={"_blank"} href={props.url}>
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}
