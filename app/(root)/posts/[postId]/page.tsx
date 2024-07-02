import React from "react";

import { getPostById } from "@/lib/actions/post.actions";
import { ContentCategoryEnum } from "@/lib/types.d";

import Error from "@/components/shared/Error";
import ContentNotFound from "@/components/shared/ContentNotFound";
import ContentOverview from "@/components/contentTypes/ContentOverview";

// Forcing component to be dynamic rather than using cache in order to show immediate updates without a refresh
export const dynamic = "force-dynamic";

const Post = async ({ params }: { params: { postId: string } }) => {
  const { post, error } = await getPostById(params.postId);

  if (!post) return <ContentNotFound contentCategory="Post" />;
  if (error) return <Error contentCategory="Post" error={error} />;

  return (
    <ContentOverview
      content={post as any}
      contentCategoryEnum={ContentCategoryEnum.POST}
      contentCategoryType="Post"
    />
  );
};

export default Post;
