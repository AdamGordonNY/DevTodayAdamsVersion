"use client";
import React, { useState, useEffect, useTransition } from "react";
import { Root, createRoot } from "react-dom/client";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import { Edit, Trash, TripleDot } from "../ui";

import { ContentCategoryEnum } from "@/lib/types.d";
import { deleteComment } from "@/lib/actions/comment.actions";
import EditCommentForm from "./EditCommentForm";
import ConfirmationModal from "../shared/ConfirmationModal";
import LikeButton from "../shared/LikeButton";

const CommentMenu = ({
  id,
  commentIdAttribute,
  body,
  contentCategory,
}: {
  id: number;
  commentIdAttribute: string;
  body: string;
  contentCategory: ContentCategoryEnum;
}) => {
  const [open, setOpen] = useState(false);
  const [formRoot, setFormRoot] = useState<Root | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const commentBodyElement = document.getElementById(commentIdAttribute);
    if (!commentBodyElement) return;
    if (formRoot) return;

    const root = createRoot(commentBodyElement);
    setFormRoot(root);
  }, [formRoot, commentIdAttribute]);

  const handleCommentEdit = () => {
    formRoot?.render(
      <EditCommentForm
        id={id}
        contentCategory={contentCategory}
        body={body}
        setIsEditing={setIsEditing}
        formRoot={formRoot}
      />
    );
    setIsEditing(true);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        event.target instanceof HTMLElement &&
        event.target.id === "edit-comment"
      ) {
        formRoot?.render(body);
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [body, formRoot]);

  const handleDelete = async () => {
    try {
      startTransition(async () => {
        await deleteComment(id);
      });
    } catch (error) {
      console.log("error in catch", error);
      toast.error("Unable to delete comment");
    }
  };

  return (
    <>
      <div className={`${isEditing ? "hidden" : ""} flex gap-x-1`}>
        <LikeButton
          contentId={id}
          contentCategory={ContentCategoryEnum.COMMENT}
          size={16}
          heartBgType="none"
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded transition duration-300 hover:bg-white-200 dark:hover:bg-dark-700">
            <TripleDot size={16} fill="fill-white-300" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="mt-2 flex w-[173px] flex-col rounded-lg border border-white-border bg-white-100 max-md:w-[347px] dark:border-dark-border dark:bg-dark-800"
            align="end"
          >
            <DropdownMenuItem
              className="relative flex cursor-pointer items-center gap-x-3 p-3 hover:rounded hover:bg-white-200 hover:p-3 dark:hover:bg-dark-700"
              onClick={handleCommentEdit}
            >
              <Edit size={18} fill="fill-dark-700 dark:fill-white-200" />
              <p className="paragraph-3-medium text-dark-700 dark:text-white-200">
                Edit Comment
              </p>
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                className="flex cursor-pointer items-center gap-x-3 p-3 hover:rounded hover:bg-white-200 hover:p-3 dark:hover:bg-dark-700"
                onClick={() => setOpen((open) => !open)}
              >
                <Trash
                  size={18}
                  className="stroke-[#FF584D]"
                  fill="fill-none"
                />
                <p className="paragraph-3-medium text-[#FF584D]">
                  Delete Comment
                </p>
              </DialogTrigger>

              <ConfirmationModal
                contentCategory="Comment"
                confirmationType="Delete"
                onSubmit={handleDelete}
                isSubmitting={pending}
              />
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={`flex gap-x-2 ${isEditing ? "" : "hidden"}`}>
        <p className="paragraph-3-regular flex-nowrap text-white-400">
          Press Esc to Cancel
        </p>
      </div>
    </>
  );
};

export default CommentMenu;
