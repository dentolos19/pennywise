import ShopItem from "@/app/(main)/shop/_components/shop-item";
import items from "@/data/shop.json";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <Box className={"p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"}>
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
