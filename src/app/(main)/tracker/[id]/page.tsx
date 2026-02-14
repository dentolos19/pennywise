"use client";

import LoadingPage from "@/app/(main)/loading";
import NotFoundPage from "@/app/not-found";
import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";
import { deleteExpense, getExpense, updateExpense } from "@/lib/expenses";
import { ExpenseDocument, ExpenseSchema } from "@/lib/integrations/appwrite/types";
import { RouteProps } from "@/types";
import { Box, Button, FormControl, InputAdornment, OutlinedInput, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page(props: RouteProps) {
  const id = props.params.id as string;

  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState<ExpenseDocument | undefined>();

  useEffect(() => {
    getExpense(id).then((res) => {
      setExpense(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!expense) return <NotFoundPage />;

  const handleSave = async (data: FormData) => {
    if (!auth.user) return;

    const expense = ExpenseSchema.parse({
      name: data.get("name"),
      description: data.get("description"),
      date: data.get("date"),
      cost: Number.parseFloat(data.get("cost") as string),
      quantity: Number.parseInt(data.get("quantity") as string),
    });

    try {
      updateExpense(id, expense);
      toast.show({ message: "Your expense has been updated!", severity: "success" });
    } catch (err) {
      console.error(err);
      toast.show({ message: "Unable to update your expense! Please try again later.", severity: "error" });
    } finally {
      router.push("/tracker");
    }
  };

  const handleDelete = async () => {
    if (!auth.user) return;
    try {
      await deleteExpense(id);
      toast.show({ message: "Your expense has been deleted!", severity: "success" });
    } catch (err) {
      console.error(err);
      toast.show({ message: "Unable to delete your expense! Please try again later.", severity: "error" });
    } finally {
      router.push("/tracker");
    }
  };

  const handleCancel = () => {
    router.push("/tracker");
  };

  return (
    <Box className={"h-full grid place-items-center"}>
      <Paper className={"p-8 w-96"} variant={"outlined"}>
        <Box component={"form"} className={"flex flex-col gap-4"} action={handleSave}>
          <Typography className={"font-bold text-2xl text-center"}>Edit Expense</Typography>
          <Box className={"flex flex-col gap-2"}>
            <TextField
              type={"text"}
              name={"name"}
              placeholder={"Name"}
              defaultValue={expense.name}
              hiddenLabel
              required
            />
            <TextField
              type={"text"}
              name={"description"}
              placeholder={"Description"}
              defaultValue={expense.description}
              hiddenLabel
              multiline
            />
            <DatePicker name={"date"} defaultValue={dayjs(expense.date)} />
            <FormControl variant={"outlined"}>
              <OutlinedInput
                type={"number"}
                name={"cost"}
                defaultValue={expense.cost}
                required
                startAdornment={<InputAdornment position={"start"}>$</InputAdornment>}
                slotProps={{
                  input: {
                    step: 0.01,
                  },
                }}
              />
            </FormControl>
            <TextField
              type={"number"}
              name={"quantity"}
              placeholder={"Quantity"}
              defaultValue={expense.quantity}
              hiddenLabel
              required
            />
          </Box>
          <Box className={"flex flex-col gap-2"}>
            <FormStatus>
              <FormStatus.Active>
                <Button variant={"contained"} color={"primary"} type={"submit"}>
                  Save
                </Button>
              </FormStatus.Active>
              <FormStatus.Pending>
                <Button variant={"contained"} color={"primary"} disabled>
                  Saving...
                </Button>
              </FormStatus.Pending>
            </FormStatus>
            <Button variant={"contained"} color={"error"} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant={"outlined"} color={"secondary"} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
