"use client";

import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";
import { createExpense } from "@/lib/expenses";
import { ExpenseSchema } from "@/lib/integrations/appwrite/types";
import { Box, Button, FormControl, InputAdornment, OutlinedInput, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  const handleCreate = async (data: FormData) => {
    if (!auth.user) return;

    const expense = ExpenseSchema.parse({
      name: data.get("name"),
      description: data.get("description"),
      date: data.get("date"),
      cost: Number.parseFloat(data.get("cost") as string),
      quantity: Number.parseInt(data.get("quantity") as string),
    });

    try {
      createExpense(auth.user.$id, expense);
      toast.show({ message: "Your expense has been created!", severity: "success" });
    } catch (err) {
      console.error(err);
      toast.show({ message: "Unable to create your expense! Please try again later.", severity: "error" });
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
        <Box component={"form"} className={"flex flex-col gap-4"} action={handleCreate}>
          <Typography className={"font-bold text-2xl text-center"}>Add Expense</Typography>
          <Box className={"flex flex-col gap-2"}>
            <TextField type={"text"} name={"name"} placeholder={"Name"} hiddenLabel required />
            <TextField type={"text"} name={"description"} placeholder={"Description"} hiddenLabel multiline />
            <DatePicker name={"date"} defaultValue={dayjs()} />
            <FormControl variant={"outlined"}>
              <OutlinedInput
                type={"number"}
                name={"cost"}
                defaultValue={"0.00"}
                required
                startAdornment={<InputAdornment position={"start"}>$</InputAdornment>}
                slotProps={{
                  input: {
                    step: 0.01,
                  },
                }}
              />
            </FormControl>
            <TextField type={"number"} name={"quantity"} defaultValue={1} hiddenLabel />
          </Box>
          <Box className={"flex flex-col gap-2"}>
            <FormStatus>
              <FormStatus.Active>
                <Button variant={"contained"} color={"primary"} type={"submit"}>
                  Add
                </Button>
              </FormStatus.Active>
              <FormStatus.Pending>
                <Button variant={"contained"} color={"primary"} disabled>
                  Adding...
                </Button>
              </FormStatus.Pending>
            </FormStatus>
            <Button variant={"outlined"} color={"secondary"} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
