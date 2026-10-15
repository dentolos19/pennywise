"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";

import LessonsTab from "@/app/(platform)/learn/_components/lessons-tab";
import ResourcesTab from "@/app/(platform)/learn/_components/resources-tab";

export default function Page() {
  const [tab, setTab] = useState<string>("lessons");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} variant={"fullWidth"} onChange={handleChange} aria-label="Learning Resources">
          <Tab id="lessons-tab" aria-controls="lessons-panel" label={"Lessons"} value={"lessons"} />
          <Tab id="resources-tab" aria-controls="resources-panel" label={"Resources"} value={"resources"} />
        </Tabs>
      </Box>
      <Box role="tabpanel" id="lessons-panel" aria-labelledby="lessons-tab" hidden={tab !== "lessons"} sx={{ p: 3 }}>
        {tab === "lessons" && <LessonsTab />}
      </Box>
      <Box
        role="tabpanel"
        id="resources-panel"
        aria-labelledby="resources-tab"
        hidden={tab !== "resources"}
        sx={{ p: 3 }}
      >
        {tab === "resources" && <ResourcesTab />}
      </Box>
    </Box>
  );
}
