"use client";

import { Avatar, Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/contexts/auth-context";
import MissingParametersView from "@/components/views/missing-parameters-view";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();

  if (!auth.user) return <MissingParametersView />;

  const handleSettings = () => {
    router.push("/profile/settings");
  };

  const handleLogout = async () => {
    await auth.logout().then(() => router.push("/"));
  };

  return (
    <Box className={"grid h-full place-items-center"}>
      <Paper className={"w-80 p-8"} variant={"elevation"}>
        <Box className={"flex flex-col gap-4"}>
          <Box className={"flex flex-col gap-2 text-center"}>
            <Avatar className={"mx-auto size-[80px] text-4xl"} sx={{ backgroundColor: blue[800] }}>
              {(auth.user.name ? auth.user.name[0] : auth.user.email[0]).toUpperCase()}
            </Avatar>
            <Typography className={"text-2xl font-bold"}>{auth.user.name}</Typography>
            <Typography color={"textSecondary"}>{auth.user?.description}</Typography>
          </Box>
          <ButtonGroup className={"[&>*]:flex-1"}>
            <Button variant={"contained"} color={"info"} onClick={handleSettings}>
              Settings
            </Button>
            <Button variant={"contained"} color={"error"} onClick={handleLogout}>
              Logout
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>
    </Box>
  );
}
