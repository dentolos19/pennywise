"use client";

import { useAuth } from "@/components/providers/auth-provider";
import MessageView from "@/components/views/message-view";
import { useChatProxy } from "@/lib/integrations/ai/main";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import { Avatar, Box, IconButton, Paper, Stack, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import clsx from "clsx";
import Markdown from "react-markdown";

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

  if (!auth.user || !auth.user.prefs.geminiApiKey)
    return (
      <MessageView
        title={"Missing Parameters"}
        message={"Please set up your Gemini API Key in the settings before proceeding!"}
      />
    );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chat = useChatProxy(auth.user.prefs.geminiApiKey);

  return (
    <Box className={"mx-auto w-[90%] md:w-[70%] h-full flex flex-col"}>
      <Stack className={"py-4 flex-1"} spacing={1}>
        {chat.messages.map((message, index) => (
          <Paper
            key={index}
            className={clsx("p-4 w-fit flex gap-4", message.role === "user" && "flex-row-reverse self-end text-end")}
          >
            <Box>
              <Avatar className={"size-[35px]"}>X</Avatar>
            </Box>
            <Box className={"flex-1"}>
              <Typography className={"font-bold text-lg"}>{humanizeRole(message.role)}</Typography>
              <Typography>
                <Markdown className={"prose prose-invert"}>{message.content}</Markdown>
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
      <Paper>
        <Toolbar>
          {chat.isLoading ? (
            <>
              <Typography className={"flex-1"}>Generating response...</Typography>
              <Tooltip title={"Stop"}>
                <IconButton className={"ml-2"} type={"button"}>
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