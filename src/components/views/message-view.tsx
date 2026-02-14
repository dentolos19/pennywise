import { Box, Paper, Typography } from "@mui/material";
import clsx from "clsx";

export default function MessageView(props: { title: string; message?: string }) {
  return (
    <Box className={"size-full grid place-items-center"}>
      <Paper className={"p-8 text-center"} variant={"outlined"}>
        <Typography className={clsx("font-bold text-2xl", props.message && "mb-2")}>{props.title}</Typography>
        {props.message && <Typography color={"textSecondary"}>{props.message}</Typography>}
      </Paper>
    </Box>
  );
}
