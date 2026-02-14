"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function Page() {
  return (
    <Container className={"max-md:py-24 h-full flex max-md:flex-col-reverse md:[&>*]:flex-1 md:gap-8"}>
      <Box className={"flex-1 flex flex-col max-md:items-center justify-center"}>
        <Typography className={"font-bold text-4xl max-md:text-center"}>Welcome to Pennywise</Typography>
        <Typography className={"mt-4 max-md:text-center"}>
          Your all-in-one solution for your financial needs! Join like-minded people to connect with and be more
          finanically capable!
        </Typography>
        <Button LinkComponent={Link} className={"mt-8 w-fit"} variant={"contained"} href={"/app"}>
          Get Started
        </Button>
      </Box>
      <Box className={"max-md:h-[40%] flex items-center justify-center"}>
        <img className={"h-[300px] max-md:h-[150px]"} src={"/assets/money.png"} alt={"Landing"} />
      </Box>
    </Container>
  );
}
