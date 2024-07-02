"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as SearchCommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SearchDialog,
  SearchDialogContent,
} from "@/components/ui/search-dialog";

const SearchCommand = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive>
>(({ className, ...props }, ref) => (
  <SearchCommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md",
      className
    )}
    {...props}
  />
));
SearchCommand.displayName = SearchCommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const SearchCommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <SearchDialog {...props}>
      <SearchDialogContent className="overflow-hidden p-0 px-4">
        <SearchCommand className="[&_[cmdk-group-heading]] border border-white-border bg-white-200 dark:border-dark-border  dark:bg-dark-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {children}
        </SearchCommand>
      </SearchDialogContent>
    </SearchDialog>
  );
};

const SearchCommandInput = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-white-border bg-white-100 px-6 dark:border-dark-border dark:bg-dark-800"
    cmdk-input-wrapper=""
  >
    <Search size={1} className="mr-2 stroke-white-400 dark:stroke-white-300" />
    <SearchCommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md  py-3 text-sm dark:text-white-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 border-none dark:bg-dark-800",
        className
      )}
      {...props}
    />
  </div>
));

SearchCommandInput.displayName = SearchCommandPrimitive.Input.displayName;

const SearchCommandList = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <SearchCommandPrimitive.List
    ref={ref}
    className={cn(
      "scroll-controller max-h-[300px] my-4 mx-2 overflow-y-auto bg-white-200 dark:bg-dark-900 overflow-x-hidden dark:text-white-200 border-white-border",
      className
    )}
    {...props}
  />
));

SearchCommandList.displayName = SearchCommandPrimitive.List.displayName;

const SearchCommandEmpty = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive.Empty>
>((props, ref) => (
  <SearchCommandPrimitive.Empty
    ref={ref}
    className="flex justify-center border-none py-6 text-center text-sm dark:bg-dark-900"
    {...props}
  />
));

SearchCommandEmpty.displayName = SearchCommandPrimitive.Empty.displayName;

const SearchCommandGroup = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <SearchCommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]] dark:bg-dark-900",
      className
    )}
    {...props}
  />
));

SearchCommandGroup.displayName = SearchCommandPrimitive.Group.displayName;

const SearchCommandSeparator = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SearchCommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px", className)}
    {...props}
  />
));
SearchCommandSeparator.displayName =
  SearchCommandPrimitive.Separator.displayName;

const SearchCommandItem = React.forwardRef<
  React.ElementRef<typeof SearchCommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SearchCommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <SearchCommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white-100 dark:hover:bg-dark-700 aria-selected:bg-none text-dark-700 dark:text-white-200 dark:paragraph-3-regular gap-x-3 dark:bg-dark-900 cursor-pointer",
      className
    )}
    {...props}
  />
));

SearchCommandItem.displayName = SearchCommandPrimitive.Item.displayName;

const SearchCommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
};
SearchCommandShortcut.displayName = "SearchCommandShortcut";

export {
  SearchCommand,
  SearchCommandDialog,
  SearchCommandInput,
  SearchCommandList,
  SearchCommandEmpty,
  SearchCommandGroup,
  SearchCommandItem,
  SearchCommandShortcut,
  SearchCommandSeparator,
};
