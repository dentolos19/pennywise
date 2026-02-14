import { Box, CircularProgress } from "@mui/material";

export default function LoadingView() {
  return (
    <Box className={"grid size-full place-items-center"}>
      <CircularProgress />
    </Box>
  );
}
