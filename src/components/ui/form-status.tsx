"use client";

import React from "react";
import { useFormStatus } from "react-dom";

function FormStatus(props: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  const activeComponent = React.Children.toArray(props.children).find(
    (child) => React.isValidElement(child) && child.type === FormStatus.Active,
  );
  const pendingComponent = React.Children.toArray(props.children).find(
    (child) => React.isValidElement(child) && child.type === FormStatus.Pending,
  );

  if (pending) return pendingComponent;
  return activeComponent;
}

FormStatus.Active = function Active(props: { children: React.ReactNode }) {
  return props.children;
};
FormStatus.Pending = function Loading(props: { children: React.ReactNode }) {
  return props.children;
};

export default FormStatus;
