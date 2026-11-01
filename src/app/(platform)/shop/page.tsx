import { Box, Typography } from "@mui/material";

import ShopItem from "@/app/(platform)/shop/_components/shop-item";
import items from "@/data/shop.json";

export default function Page() {
  return (
    <Box className={"p-4"}>
      <Typography className={"mb-4"}>Demo rewards deduct points only; no item or email will be delivered.</Typography>
      <Box className={"grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"}>
        {items.map((item) => (
          <ShopItem
            key={item.name}
            name={item.name}
            description={item.description}
            points={item.points}
            imageUrl={item.imageUrl}
          />
        ))}
      </Box>
    </Box>
  );
}
