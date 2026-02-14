"use client";

import { Box, Button, ButtonGroup, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";
import MissingParametersView from "@/components/views/missing-parameters-view";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  if (!auth.user) return <MissingParametersView />;

  const handleSave = async (data: FormData) => {
    if (!auth.user) return;

    const user_name = data.get("name") as string;
    const user_description = data.get("description") as string;

    try {
      await authClient.updateUser({
        name: user_name,
        description: user_description,
      });
      toast.show({ message: "Your settings has been saved!", severity: "success" });
    } catch {
      toast.show({ message: "Failed to save settings! Please try again later.", severity: "error" });
    } finally {
      auth.refresh();
      router.push("/profile");
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <Box className={"grid h-full place-items-center"}>
      <Paper className={"w-96 p-8"} variant={"elevation"}>
        <Box component={"form"} className={"flex flex-col gap-4"} action={handleSave}>
          <Typography className={"text-center text-2xl font-bold"}>Settings</Typography>
          <Box className={"flex flex-col gap-2"}>
            <TextField
              variant={"filled"}
              size={"small"}
              type={"text"}
              name={"name"}
              label={"Name"}
              defaultValue={auth.user.name}
              required
            />
            <TextField
              variant={"filled"}
              size={"small"}
              type={"text"}
              name={"description"}
              label={"Description"}
              defaultValue={auth.user.description}
              multiline
            />
            <TextField
              variant={"filled"}
              size={"small"}
              type={"email"}
              name={"email"}
              label={"Email"}
              value={auth.user.email}
              required
              disabled
            />
          </Box>
          <ButtonGroup className={"[&>*]:flex-1"}>
            <FormStatus>
              <FormStatus.Active>
                <Button variant={"contained"} color={"info"} type={"submit"}>
                  Save
                </Button>
              </FormStatus.Active>
              <FormStatus.Pending>
                <Button variant={"contained"} color={"info"} disabled>
                  Saving...
                </Button>
              </FormStatus.Pending>
            </FormStatus>
            <Button variant={"contained"} color={"error"} type={"button"} onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>
    </Box>
  );
}
