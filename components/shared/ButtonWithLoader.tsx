"use client";
import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
const ButtonWithLoader = ({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) => {
  return (
    <Button disabled={pending}>
      {children} <Loader2 className="ml-2 animate-spin" />{" "}
    </Button>
  );
};

export default ButtonWithLoader;
