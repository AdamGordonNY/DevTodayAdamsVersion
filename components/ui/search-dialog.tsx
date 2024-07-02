"use client";

import * as React from "react";
import * as SearchDialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";

const SearchDialog = SearchDialogPrimitive.Root;

const SearchDialogTrigger = SearchDialogPrimitive.Trigger;

const SearchDialogPortal = SearchDialogPrimitive.Portal;

const SearchDialogClose = SearchDialogPrimitive.Close;

const SearchDialogOverlay = React.forwardRef<
  React.ElementRef<typeof SearchDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SearchDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SearchDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 backdrop-blur  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SearchDialogOverlay.displayName = SearchDialogPrimitive.Overlay.displayName;

const SearchDialogContent = React.forwardRef<
  React.ElementRef<typeof SearchDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SearchDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SearchDialogPortal>
    <SearchDialogOverlay />
    <SearchDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 dark:border-dark-border p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      <SearchDialogPrimitive.Close className="data-[state=open] absolute right-3 top-3 mx-4 rounded-sm ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent">
        <div className="caption-10 rounded bg-white-200 p-1.5 text-[#ADB3CC] max-md:hidden dark:bg-dark-700">
          ESC
        </div>
        <span className="sr-only">Close</span>
      </SearchDialogPrimitive.Close>
    </SearchDialogPrimitive.Content>
  </SearchDialogPortal>
));
SearchDialogContent.displayName = SearchDialogPrimitive.Content.displayName;

const SearchDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SearchDialogHeader.displayName = "SearchDialogHeader";

const SearchDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SearchDialogFooter.displayName = "SearchDialogFooter";

const SearchDialogTitle = React.forwardRef<
  React.ElementRef<typeof SearchDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SearchDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SearchDialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
SearchDialogTitle.displayName = SearchDialogPrimitive.Title.displayName;

const SearchDialogDescription = React.forwardRef<
  React.ElementRef<typeof SearchDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SearchDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SearchDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm", className)}
    {...props}
  />
));
SearchDialogDescription.displayName =
  SearchDialogPrimitive.Description.displayName;

export {
  SearchDialog,
  SearchDialogPortal,
  SearchDialogOverlay,
  SearchDialogClose,
  SearchDialogTrigger,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogFooter,
  SearchDialogTitle,
  SearchDialogDescription,
};
