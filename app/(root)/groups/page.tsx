import HomeContent from "@/components/home/HomeContent";
import SharedSidebars from "@/components/layout/SharedSidebars";
import MotionDiv from "@/components/shared/MotionDiv";

import React, { Suspense } from "react";

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const filter =
    (searchParams.filter as "newest" | "popular" | "following") || "newest";
  const page = Number(searchParams.page) || 1;

  return (
    <SharedSidebars contentType="groups" filter={filter!}>
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<MotionDiv>Loading...</MotionDiv>}
      >
        <HomeContent query={filter} currentPage={page} type="groups" />
      </Suspense>
    </SharedSidebars>
  );
};

export default Home;
