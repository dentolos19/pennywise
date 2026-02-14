"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";
import { createPost } from "@/lib/posts";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  const handlePost = async (data: FormData) => {
    if (!auth.user) return;

    const content = data.get("content") as string;

    try {
      await createPost(auth.user.$id, { content });
      toast.show({ message: "Your post has been created!", severity: "success" });
    } catch (err) {
      console.error(err);
      toast.show({ message: "Unable to create your post! Please try again later.", severity: "error" });
    } finally {
      router.push("/community");
    }
  };

  const handleCancel = () => {
    router.push("/community");
  };

  return (
    <Box className={"h-full grid place-items-center"}>
      <Paper className={"p-8 w-96"} variant={"outlined"}>
        <Box component={"form"} className={"flex flex-col gap-4"} action={handlePost}>
          <Typography className={"font-bold text-2xl text-center"}>Create Post</Typography>
          <Box className={"flex flex-col gap-2"}>
            <TextField type={"text"} name={"content"} placeholder={"Content"} hiddenLabel multiline required />
          </Box>
          <Box className={"flex flex-col gap-2"}>
            <FormStatus>
              <FormStatus.Active>
                <Button variant={"contained"} color={"primary"} type={"submit"}>
                  Post
                </Button>
              </FormStatus.Active>
              <FormStatus.Pending>
                <Button variant={"contained"} color={"primary"} disabled>
                  Posting...
                </Button>
              </FormStatus.Pending>
            </FormStatus>
            <Button variant={"outlined"} color={"secondary"} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
