"use client";

import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { createContext, SyntheticEvent, useContext, useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<(ToastProps & { key: number }) | undefined>();
  const [toastQueue, setToastQueue] = useState<(ToastProps & { key: number })[]>([]);

  useEffect(() => {
    if (toastQueue.length && !toast) {
      setToast({ ...toastQueue[0] });
      setToastQueue((prev) => prev.slice(1));
      setOpen(true);
    } else if (toastQueue.length && toast && open) {
      setOpen(false);
    }
  }, [open, toast, toastQueue]);

  const addToast = (props: ToastProps) => {
    setToastQueue((prev) => [
      ...prev,
      {
        ...props,
        key: new Date().getTime(),
      },
    ]);
  };

  const handleClose = (event: Event | SyntheticEvent, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExited = () => {
    setToast(undefined);
  };

  return (
    <ToastContext.Provider value={{ show: addToast }}>
      {props.children}
      <Snackbar
        key={toast ? toast.key : undefined}
        open={open}
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
