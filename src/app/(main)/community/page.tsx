import PostItem from "@/app/(main)/community/_components/post-item";
import { getPosts } from "@/lib/posts";
import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const revalidate = 0;

export default async function Page() {
  const posts = await getPosts();
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