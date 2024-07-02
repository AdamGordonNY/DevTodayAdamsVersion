import { ContentCategoryType } from "@/lib/types.d";
import Link from "next/link";

const Error = ({
  contentCategory,
  error,
}: {
  contentCategory: ContentCategoryType;
  error: string;
}) => {
  const pluralLowerCaseContentType = `${contentCategory.toLowerCase()}s`;

  return (
    <div className="paragraph-1-medium m-20 flex flex-col justify-center gap-y-6 text-dark-700 dark:text-white-200">
      <h1 className="text-center">
        Error returning {contentCategory.toLowerCase()}: {error}
      </h1>
      <Link
        className="rounded bg-primary-500 px-4 py-2 text-white-200 hover:opacity-70"
        href={`/${pluralLowerCaseContentType}`}
      >{`Click here to view all ${pluralLowerCaseContentType}`}</Link>
    </div>
  );
};

export default Error;
