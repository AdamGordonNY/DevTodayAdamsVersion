import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TripleDot } from "../ui";
import ConfirmationModal from "../shared/ConfirmationModal";
import { checkIfAdmin, toggleAdmin } from "@/lib/actions/group.actions";

const GroupMembersMenu = ({
  memberId,
  groupId,
}: {
  memberId: number;
  groupId: number;
}) => {
  const [isSubmitting, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      startTransition(async () => {
        // await actionType();
      });
    } catch (error) {
      console.log("error in catch", error);
      toast.error(`Unable to delete `);
    } finally {
      setOpen(false);
    }
  };
  const handleToggleAdmin = async () => {
    try {
      startTransition(async () => {
        const isAdmin = await checkIfAdmin(memberId);
        if (!isAdmin) {
          const newAdmin = await toggleAdmin(groupId, memberId);
          newAdmin?.ok
            ? toast.success(`User is now an admin`)
            : toast.error(`Unable to assign admin role`);
        }
      });
    } catch (error) {
      console.log("error in catch", error);
      toast.error(`Unable to delete `);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <TripleDot size={16} fill="fill-white-300 dark:fill-white-100" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="mt-2 flex w-[160px] flex-col rounded-lg bg-white-100 max-md:w-[347px] dark:bg-dark-700"
          align="end"
        >
          <div
            className="relative flex cursor-pointer items-center gap-x-3 p-3 hover:rounded hover:bg-white-200 hover:p-3 dark:hover:bg-dark-800"
            onClick={() => handleToggleAdmin()}
          >
            <p className="paragraph-3-medium text-dark-700 dark:text-white-200">
              Assign Admin Role
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className="flex cursor-pointer items-center gap-x-3 p-3 hover:rounded hover:bg-white-200 hover:p-3 dark:hover:bg-dark-800"
              onClick={() => setOpen((open) => !open)}
            >
              <p className="paragraph-3-medium text-[#FF584D]">Remove User</p>
            </DialogTrigger>

            <ConfirmationModal
              contentCategory="User"
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

export default GroupMembersMenu;
