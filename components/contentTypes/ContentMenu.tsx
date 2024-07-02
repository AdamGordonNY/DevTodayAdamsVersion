import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MotionDiv from "../shared/MotionDiv";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash, TripleDot } from "../ui";
import ConfirmationModal from "../shared/ConfirmationModal";
import { deletePodcast } from "@/lib/actions/podcast.actions";
import { deletePost } from "@/lib/actions/post.actions";
import { deleteMeetup } from "@/lib/actions/meetup.actions";
import { deleteGroup } from "@/lib/actions/group.actions";
import { ContentCategoryType } from "@/lib/types.d";

const ContentMenu = ({
  contentId,
  contentCategory,
}: {
  contentId: number;
  contentCategory: ContentCategoryType;
}) => {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const lowerCaseContentCategory = `${contentCategory.toLowerCase()}`;

  const actionType = async () => {
    switch (contentCategory) {
      case "Post":
        await deletePost(contentId);
        break;
      case "Meetup":
        await deleteMeetup(contentId);
        break;
      case "Podcast":
        await deletePodcast(contentId);
        break;
      case "Group":
        await deleteGroup(contentId);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    try {
      startTransition(async () => {
        await actionType();
      });
      router.push(`/${lowerCaseContentCategory}s`);
    } catch (error) {
      console.log("error in catch", error);
      toast.error(`Unable to delete ${lowerCaseContentCategory}`);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <MotionDiv
          className="mt-1.5"
          whileHover={{
            scale: 1.4,
            originY: 0.18,
          }}
          transition={{
            duration: 0.2,
            ease: "linear",
          }}
        >
          <DropdownMenuTrigger>
            <TripleDot size={20} fill="fill-white-300 dark:fill-white-100" />
          </DropdownMenuTrigger>
        </MotionDiv>
        <DropdownMenuContent
          className="mt-2 flex w-[160px] flex-col rounded-lg bg-white-100 max-md:w-[347px] dark:bg-dark-800"
          align="end"
        >
          <div
            className="relative flex cursor-pointer items-center gap-x-3 p-3 transition duration-300 hover:rounded hover:bg-white-200 hover:p-3 dark:hover:bg-dark-700"
            onClick={() =>
              router.push(
                `/${lowerCaseContentCategory}s/${contentId}/edit-${lowerCaseContentCategory}`
              )
            }
          >
            <Edit size={18} fill="fill-dark-700 dark:fill-white-200" />
            <p className="paragraph-3-medium text-dark-700 dark:text-white-200">
              Edit {contentCategory}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className="flex cursor-pointer items-center gap-x-3 p-3 transition duration-300 hover:rounded hover:bg-white-200 hover:p-3 dark:hover:bg-dark-700"
              onClick={() => setOpen((open) => !open)}
            >
              <Trash size={18} className="stroke-[#FF584D]" fill="fill-none" />
              <p className="paragraph-3-medium text-[#FF584D]">
                Delete {contentCategory}
              </p>
            </DialogTrigger>

            <ConfirmationModal
              contentCategory={contentCategory}
              confirmationType="Delete"
              onSubmit={handleDelete}
              isSubmitting={isSubmitting}
            />
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ContentMenu;
