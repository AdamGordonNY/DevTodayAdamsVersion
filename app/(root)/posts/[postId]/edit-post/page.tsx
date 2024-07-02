import { redirect } from "next/navigation";

import CreateOrEditPost from "@/components/contentTypes/CreateOrEditPost";
import { getPostById } from "@/lib/actions/post.actions";
import { isUserAuthor } from "@/lib/actions/user.actions";
import { PostContent } from "@/lib/types.d";

// Forcing component to be dynamic rather than using cache in order to show immediate updates without a refresh
export const dynamic = "force-dynamic";

const EditPostWrapper = async ({ params }: { params: { postId: string } }) => {
  const post = await getPostById(params.postId);
  const { isAuthor } = await isUserAuthor(post?.post?.userId as number);

  if (!isAuthor) redirect("/");

  return <CreateOrEditPost post={post.post as PostContent} />;
};

export default EditPostWrapper;
