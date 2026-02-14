"use client";

import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { createContext, SyntheticEvent, useContext, useState } from "react";

type ToastProps = {
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

type ToastContextProps = {
  show: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextProps>({
  show: () => {
    throw new Error("Function not implemented.");
  },
});

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider(props: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    toasts: (ToastProps & { key: number })[];
  }>({ open: false, toasts: [] });

  const toast = state.toasts[0];

  const addToast = (props: ToastProps) => {
    setState((current) => ({
      open: current.toasts.length ? current.open : true,
      toasts: [...current.toasts, { ...props, key: Date.now() }],
    }));
  };

  const handleClose = (event: Event | SyntheticEvent, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setState((current) => ({ ...current, open: false }));
  };

  const handleExited = () => {
    setState((current) => ({ open: current.toasts.length > 1, toasts: current.toasts.slice(1) }));
  };

  return (
    <ToastContext.Provider value={{ show: addToast }}>
      {props.children}
      <Snackbar
        key={toast ? toast.key : undefined}
        open={state.open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert variant={"filled"} severity={toast?.severity} onClose={handleClose}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
