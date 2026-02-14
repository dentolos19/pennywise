import { Box } from "@mui/material";

import ResourceItem from "@/app/(platform)/learn/_components/resource-item";
import resources from "@/data/resources.json";

export default function ResourcesTab() {
  return (
    <Box className={"grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"}>
      {resources.map((resource, index) => (
        <ResourceItem
          key={index}
          name={resource.name}
          description={resource.description}
          url={resource.url}
          imageUrl={resource.imageUrl}
        />
      ))}
    </Box>
  );
}
