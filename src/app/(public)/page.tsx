"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function Page() {
  return (
    <Container className={"flex h-full max-md:flex-col-reverse max-md:py-24 md:gap-8 md:[&>*]:flex-1"}>
      <Box className={"flex flex-1 flex-col justify-center max-md:items-center"}>
        <Typography className={"text-4xl font-bold max-md:text-center"}>Welcome to Pennywise</Typography>
        <Typography className={"mt-4 max-md:text-center"}>
          Your all-in-one solution for your financial needs! Join like-minded people to connect with and be more
          finanically capable!
        </Typography>
        <Button LinkComponent={Link} className={"mt-8 w-fit"} variant={"contained"} href={"/app"}>
          Get Started
        </Button>
      </Box>
      <Box className={"flex items-center justify-center max-md:h-[40%]"}>
        <img className={"h-[300px] max-md:h-[150px]"} src={"/assets/money.png"} alt={"Landing"} />
      </Box>
    </Container>
  );
}
