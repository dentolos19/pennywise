import { Box, CircularProgress } from "@mui/material";

export default function LoadingView() {
  return (
    <Box className={"size-full grid place-items-center"}>
      <CircularProgress />
    </Box>
  );
}
