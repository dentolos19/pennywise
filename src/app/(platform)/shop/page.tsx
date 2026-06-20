import { Box } from "@mui/material";

import ShopItem from "@/app/(platform)/shop/_components/shop-item";
import items from "@/data/shop.json";

export default function Page() {
  return (
    <Box className={"grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3"}>
      {items.map((item, index) => (
        <ShopItem
          key={index}
          name={item.name}
          description={item.description}
          points={item.points}
          imageUrl={item.imageUrl}
        />
      ))}
    </Box>
  );
}
