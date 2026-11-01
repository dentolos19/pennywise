"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import PostItem from "@/app/(platform)/community/_components/post-item";
import { getPostsWithUsersAction } from "@/app/(platform)/community/actions";
import LoadingView from "@/components/views/loading-view";
import MessageView from "@/components/views/message-view";
import type { PostWithUser } from "@/lib/posts";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);

  useEffect(() => {
    let active = true;
    getPostsWithUsersAction()
      .then((data) => {
        if (active) setPosts(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <LoadingView />;
  if (loadError) return <MessageView title={"Unable to load posts"} message={"Please try again later."} />;

  return (
    <Box>
      <Stack className={"mx-auto w-[90%] py-4 md:w-[60%] lg:w-[40%]"} spacing={1}>
        {posts.length === 0 && (
          <Typography className={"mt-16 text-center"}>Get started by creating a new post!</Typography>
        )}
        {posts.map((post) => (
          <PostItem key={post.id} data={post} onDeleted={() => setPosts((current) => current.filter((item) => item.id !== post.id))} />
        ))}
      </Stack>
      <Fab LinkComponent={Link} className={"fixed right-4 bottom-4 md:right-8 md:bottom-8"} href={"/community/post"}>
        <AddIcon />
      </Fab>
    </Box>
  );
}
