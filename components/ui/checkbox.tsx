"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "rounded-[8px] h-9  disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(" items-center justify-center text-current hidden")}
    >
      <Check className="size-4" />
    </CheckboxPrimitive.Indicator>
    {children}
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
