"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import PostItem from "@/app/(platform)/community/_components/post-item";
import { getPostsWithUsersAction } from "@/app/(platform)/community/actions";
import LoadingView from "@/components/views/loading-view";
import type { Post } from "@/lib/posts";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<(Post & { user: any })[]>([]);

  useEffect(() => {
    getPostsWithUsersAction().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingView />;

  return (
    <Box>
      <Stack className={"mx-auto w-[90%] py-4 md:w-[60%] lg:w-[40%]"} spacing={1}>
        {posts.length === 0 && (
          <Typography className={"mt-16 text-center"}>Get started by creating a new post!</Typography>
        )}
        {posts.map((post) => (
          <PostItem key={post.id} data={post} />
        ))}
      </Stack>
      <Fab LinkComponent={Link} className={"fixed bottom-4 right-4 md:bottom-8 md:right-8"} href={"/community/post"}>
        <AddIcon />
      </Fab>
    </Box>
  );
}
