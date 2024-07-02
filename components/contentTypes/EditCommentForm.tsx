import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useTransition,
} from "react";
import { Root } from "react-dom/client";
import toast from "react-hot-toast";

import { updateComment } from "@/lib/actions/comment.actions";
import { Textarea } from "../ui/textarea";
import { ContentCategoryEnum } from "@/lib/types.d";

const EditCommentForm = ({
  id,
  contentCategory,
  body,
  setIsEditing,
  formRoot,
}: {
  id: number;
  contentCategory: ContentCategoryEnum;
  body: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  formRoot: Root;
}) => {
  const updatedCommentText = useRef(body);
  const [pending, startTransition] = useTransition();

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        updatedCommentText: updatedCommentText.current,
        contentCategory,
        id,
      };

      startTransition(async () => {
        const updatedComment = await updateComment(dataToSend);
        if (updatedComment) {
          formRoot?.render(updatedCommentText.current);
          setIsEditing(false);
        }
      });
    } catch (error) {
      console.log("error in catch", error);
      toast.error("Unable to create or edit post");
    }
  };

  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        event.target instanceof HTMLElement &&
        event.target.id === "edit-comment"
      ) {
        handleSubmit();
        formRoot?.render(body);
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleEnter);

    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [body]);

  return (
    <div className="flex flex-col gap-y-4">
      <Textarea
        id="edit-comment"
        className="comment-scroll-controller paragraph-2-regular min-h-[100px] resize-none bg-white-200 text-dark-700 dark:bg-dark-900 dark:text-white-300"
        defaultValue={body}
        onChange={(e) => (updatedCommentText.current = e.target.value)}
      />

      <button
        id="save-comment"
        className="paragraph-3-medium flex justify-end text-white-400 hover:text-primary-500"
        type="submit"
        onClick={handleSubmit}
      >
        {pending ? <p className="animate-pulse">Saving...</p> : <p>Save</p>}
      </button>
    </div>
  );
};

export default EditCommentForm;
