import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ContentCategoryType } from "@/lib/types.d";

const ConfirmationModal = ({
  contentCategory,
  confirmationType,
  onSubmit,
  isSubmitting,
}: {
  contentCategory: ContentCategoryType;
  confirmationType: string;
  onSubmit: () => void;
  isSubmitting: boolean;
}) => {
  return (
    <DialogContent className="flex w-[420px] flex-col justify-center border-none p-8 dark:bg-dark-800">
      <DialogHeader className="mb-3">
        <DialogTitle>
          <p className="paragraph-1-medium text-center dark:text-white-100">
            Are you sure you want to {confirmationType.toLowerCase()} this{" "}
            {contentCategory.toLowerCase()}?
          </p>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="flex w-full flex-nowrap justify-between gap-x-1 max-md:flex-row max-md:gap-x-3">
        <DialogClose className="paragraph-3-bold w-full rounded-lg bg-white-400 text-white-100 dark:bg-dark-700 dark:text-white-100">
          Cancel
        </DialogClose>
        <Button
          className=" w-full bg-destructive-error"
          type="submit"
          onClick={onSubmit}
        >
          <p className="paragraph-3-bold">
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              `${confirmationType} ${contentCategory}`
            )}
          </p>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ConfirmationModal;
