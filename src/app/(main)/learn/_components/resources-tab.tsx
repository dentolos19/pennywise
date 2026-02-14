import ResourceItem from "@/app/(main)/learn/_components/resource-item";
import resources from "@/data/resources.json";
import { Box } from "@mui/material";

export default function ResourcesTab() {
  return (
    <Box className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"}>
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
