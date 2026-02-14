"use client";

import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import { Avatar, Box, IconButton, Paper, Stack, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import clsx from "clsx";
import Markdown from "react-markdown";

import { useAuth } from "@/components/contexts/auth-context";
import MessageView from "@/components/views/message-view";
import { useChatProxy } from "@/lib/ai/main";
import { onKeyCallback } from "@/lib/utils";

function humanizeRole(role: string | "system" | "data" | "user" | "assistant") {
  switch (role) {
    case "system":
      return "System";
    case "data":
      return "Data";
    case "user":
      return "You";
    case "assistant":
      return "Pennywise";
    default:
      return role;
  }
}

export default function Page() {
  const auth = useAuth();
  const chat = useChatProxy();

  if (!auth.user) return <MessageView title={"Missing Parameters"} message={"Please log in to use the chat."} />;

  return (
    <Box className={"grid size-full grid-rows-[1fr,auto] overflow-hidden"}>
      <Box className={"overflow-y-auto"}>
        <Stack className={"mx-auto w-[90%] py-4"} spacing={1}>
          {chat.messages.length === 0 && (
            <Typography className={"mt-16 text-center"}>Get started by sending a prompt!</Typography>
          )}
          {chat.messages.map((message, index) => (
            <Paper
              key={index}
              className={clsx("p-4 w-fit flex gap-4", message.role === "user" && "flex-row-reverse self-end text-end")}
            >
              <Box>
                <Avatar className={"size-[35px]"}>X</Avatar>
              </Box>
              <Box className={"flex-1"}>
                <Typography className={"text-lg font-bold"}>{humanizeRole(message.role)}</Typography>
                <Typography>
                  <Markdown className={"prose prose-invert"}>{message.content}</Markdown>
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
      <Paper>
        <Toolbar>
          {chat.isLoading ? (
            <>
              <Typography className={"flex-1"}>Generating response...</Typography>
              <Tooltip title={"Stop"}>
                <IconButton className={"ml-2"} type={"button"} onClick={chat.stop}>
                  <StopIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <TextField
                className={"flex-1"}
                variant={"filled"}
                size={"small"}
                type={"text"}
                placeholder={"Prompt"}
                value={chat.input}
                hiddenLabel
                disabled={chat.isLoading}
                onChange={chat.handleInputChange}
                onKeyDown={onKeyCallback("Enter", chat.handleSubmit)}
              />
              <Tooltip title={"Send"}>
                <IconButton className={"ml-2"} onClick={chat.handleSubmit}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </Paper>
    </Box>
  );
}
