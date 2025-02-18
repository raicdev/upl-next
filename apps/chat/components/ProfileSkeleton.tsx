"use client";

import React from "react";
import { Skeleton } from "@repo/ui/components/skeleton";
import MessageSkeleton from "./MessageSkeleton";

const ProfileSkeleton = () => {
  return (
    <main className="p-5 w-full">
      <div className="mx-auto">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-32 h-32 rounded-full" />

          <Skeleton className="w-64 h-8" />

          <Skeleton className="w-16 h-4" />


          <Skeleton className="w-96 h-4" />

          <Skeleton className="w-16 h-4" />

         <Skeleton className="w-32 h-8 rounded-md" />

         <MessageSkeleton />
        </div>
      </div>
    </main>
  );
};

export default ProfileSkeleton;
