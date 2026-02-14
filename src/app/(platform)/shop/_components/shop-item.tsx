"use client";

import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";

import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";
import { authClient } from "@/lib/auth-client";

export default function ShopItem(props: { name: string; description?: string; points: number; imageUrl: string }) {
  const auth = useAuth();
  const toast = useToast();

  const handleRedeem = async () => {
    if (!auth.user) return;
    if ((auth.user.points || 0) < props.points) {
      toast.show({
        message: "You don't have enough points to redeem this item!",
        severity: "error",
      });
    } else {
      await authClient
        .updateUser({
          points: (auth.user.points || 0) - props.points,
        })
        .then(() => {
          auth.refresh();
          toast.show({
            message: "Item redeemed successfully! Please check your email for more details.",
            severity: "success",
          });
        });
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
