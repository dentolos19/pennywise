"use client";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deletePostAction, getPostAction, updatePostAction } from "@/app/(platform)/community/actions";
import LoadingPage from "@/app/(platform)/loading";
import NotFoundPage from "@/app/not-found";
import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";
import type { Post } from "@/lib/posts";
import { RouteProps } from "@/types";

export default function Page(props: RouteProps) {
  const id = props.params.id as string;

  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | undefined>();

  useEffect(() => {
    getPostAction(id).then((res) => {
      setPost(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!post) return <NotFoundPage />;

  const handleSave = async (data: FormData) => {
    if (!auth.user) return;

    const content = data.get("content") as string;

    try {
      await updatePostAction(id, { content });
      toast.show({ message: "Your post has been updated!", severity: "success" });
    } catch (err) {
      console.error(err);
      toast.show({ message: "Unable to update your post! Please try again later.", severity: "error" });
    } finally {
      router.push("/community");
    }
  };

  const handleDelete = async () => {
    if (!auth.user) return;
    try {
      await deletePostAction(id);
      toast.show({ message: "Your post has been deleted!", severity: "success" });
    } catch (err) {
      console.error(err);
      toast.show({ message: "Unable to delete your post! Please try again later.", severity: "error" });
    } finally {
      router.push("/community");
    }
  };

  const handleCancel = () => {
    router.push("/community");
  };

  return (
    <Box className={"grid h-full place-items-center"}>
      <Paper className={"w-96 p-8"} variant={"outlined"}>
        <Box component={"form"} className={"flex flex-col gap-4"} action={handleSave}>
          <Typography className={"text-center text-2xl font-bold"}>Edit Post</Typography>
          <Box className={"flex flex-col gap-2"}>
            <TextField
              type={"text"}
              name={"content"}
              placeholder={"Content"}
              defaultValue={post.content}
              hiddenLabel
              multiline
              required
            />
          </Box>
          <Box className={"flex flex-col gap-2"}>
            <FormStatus>
              <FormStatus.Active>
                <Button variant={"contained"} color={"primary"} type={"submit"}>
                  Save
                </Button>
              </FormStatus.Active>
              <FormStatus.Pending>
                <Button variant={"contained"} color={"primary"} disabled>
                  Saving...
                </Button>
              </FormStatus.Pending>
            </FormStatus>
            <Button variant={"contained"} color={"error"} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant={"outlined"} color={"secondary"} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
