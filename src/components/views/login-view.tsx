import { Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import FormStatus from "@/components/ui/form-status";

export default function LoginView() {
  const auth = useAuth();
  const toast = useToast();
  const [phase, setPhase] = useState<"login" | "register">("login");

  const handleLogin = async (data: FormData) => {
    try {
      const email = data.get("email");
      const password = data.get("password");
      if (typeof email !== "string" || typeof password !== "string") throw new Error("Invalid credentials.");
      await auth.login(email, password);
    } catch (err) {
      console.error(err);
      toast.show({
        message: "Unable to login! Did you enter the correct credentials?",
        severity: "error",
      });
    }
  };

  const handleRegister = async (data: FormData) => {
    try {
      const name = data.get("name");
      const email = data.get("email");
      const password = data.get("password");
      const confirmPassword = data.get("confirmPassword");
      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof confirmPassword !== "string"
      ) throw new Error("Invalid registration data.");
      if (password !== confirmPassword) {
        toast.show({ message: "Passwords do not match.", severity: "error" });
        return;
      }
      await auth.register(email, password, name);
    } catch (err) {
      console.error(err);
      toast.show({
        message: "Unable to register! Please try again later.",
        severity: "error",
      });
    }
  };

  return (
    <Box className={"grid size-full place-items-center"}>
      <Paper className={"w-96 p-8"} variant={"outlined"}>
        {phase === "login" && (
          <Box component={"form"} className={"flex flex-col gap-4"} action={handleLogin}>
            <Typography className={"text-center text-2xl font-bold"}>Welcome back!</Typography>
            <Box className={"flex flex-col gap-2"}>
              <TextField
                variant={"filled"}
                size={"small"}
                type={"email"}
                name={"email"}
                placeholder={"Email"}
                hiddenLabel
                required
              />
              <TextField
                variant={"filled"}
                size={"small"}
                type={"password"}
                name={"password"}
                placeholder={"Password"}
                hiddenLabel
                required
              />
            </Box>
            <Box className={"flex flex-col gap-2"}>
              <FormStatus>
                <FormStatus.Active>
                  <Button variant={"contained"} color={"primary"} type={"submit"}>
                    Login
                  </Button>
                </FormStatus.Active>
                <FormStatus.Pending>
                  <Button variant={"contained"} color={"primary"} disabled>
                    Logging in...
                  </Button>
                </FormStatus.Pending>
              </FormStatus>
              <Typography className={"text-center"}>
                {"Don't"} have an account?{" "}
                <Link component={"button"} type={"button"} onClick={() => setPhase("register")}>
                  Register now!
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
        {phase === "register" && (
          <Box component={"form"} className={"flex flex-col gap-4"} action={handleRegister}>
            <Typography className={"text-center text-2xl font-bold"}>Hello there!</Typography>
            <Box className={"flex flex-col gap-2"}>
              <TextField
                variant={"filled"}
                size={"small"}
                type={"text"}
                name={"name"}
                placeholder={"Name"}
                hiddenLabel
                required
              />
              <TextField
                variant={"filled"}
                size={"small"}
                type={"email"}
                name={"email"}
                placeholder={"Email"}
                hiddenLabel
                required
              />
              <TextField
                variant={"filled"}
                size={"small"}
                type={"password"}
                name={"password"}
                placeholder={"Password"}
                hiddenLabel
                required
              />
              <TextField
                variant={"filled"}
                size={"small"}
                type={"password"}
                name={"confirmPassword"}
                placeholder={"Confirm Password"}
                hiddenLabel
                required
              />
            </Box>
            <Box className={"flex flex-col gap-2"}>
              <FormStatus>
                <FormStatus.Active>
                  <Button variant={"contained"} color={"primary"} type={"submit"}>
                    Register
                  </Button>
                </FormStatus.Active>
                <FormStatus.Pending>
                  <Button variant={"contained"} color={"primary"} disabled>
                    Registering
                  </Button>
                </FormStatus.Pending>
              </FormStatus>
              <Typography className={"text-center"}>
                Have an account already?{" "}
                <Link component={"button"} type={"button"} onClick={() => setPhase("login")}>
                  Login now!
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
