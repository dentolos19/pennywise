"use client";

import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";

import { redeemItemAction } from "@/app/(platform)/shop/actions";
import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";

export default function ShopItem(props: { name: string; description?: string; points: number; imageUrl: string }) {
  const auth = useAuth();
  const toast = useToast();

  const handleRedeem = async () => {
    if (!auth.user) return;
    try {
      await redeemItemAction(props.name);
      await auth.refresh();
      toast.show({
        message: "Demo redemption complete. Points were deducted; no item or email will be delivered.",
        severity: "success",
      });
    } catch {
      toast.show({ message: "Unable to redeem this item. Check your points and try again.", severity: "error" });
    }
  };

  return (
    <Card component={"form"} className={"flex flex-col"} action={handleRedeem}>
      <CardMedia className={"h-[150px]"} image={props.imageUrl} />
      <CardContent className={"flex-1"}>
        <Typography className={"text-2xl"} gutterBottom>
          {props.name}
        </Typography>
        <Typography color={"textSecondary"}>{props.description}</Typography>
      </CardContent>
      <CardActions>
        <FormStatus>
          <FormStatus.Active>
            <Button type={"submit"}>Redeem</Button>
          </FormStatus.Active>
          <FormStatus.Pending>
            <Button disabled>Redeeming...</Button>
          </FormStatus.Pending>
        </FormStatus>
        <Chip label={`${props.points} points`} />
      </CardActions>
    </Card>
  );
}
