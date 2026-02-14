"use client";

import PostItem from "@/app/(main)/community/_components/post-item";
import LoadingView from "@/components/views/loading-view";
import { PostDocument } from "@/lib/integrations/appwrite/types";
import { getPosts } from "@/lib/posts";
import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostDocument[]>([]);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingView />;

  return (
    <Box>
      <Stack className={"py-4 mx-auto w-[90%] md:w-[60%] lg:w-[40%]"} spacing={1}>
        {posts.length === 0 && (
          <Typography className={"mt-16 text-center"}>Get started by creating a new post!</Typography>
        )}
        {posts.map((post) => (
          <PostItem key={post.$id} data={post} />
        ))}
      </Stack>
      <Fab LinkComponent={Link} className={"fixed right-4 md:right-8 bottom-4 md:bottom-8"} href={"/community/post"}>
        <AddIcon />
      </Fab>
    </Box>
  );
}
