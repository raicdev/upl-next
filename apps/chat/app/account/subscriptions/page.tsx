"use client";

import React, { Suspense } from "react";
import { Loading } from "@shadcn/loading";
import SubscriptionPage from "@/components/SubscriptionPage";
import { SidebarProvider } from "@shadcn/sidebar";

const Login: React.FC = () => {
  return (
    <SidebarProvider className="mt-8">
      <div className="min-h-screen w-full flex flex-col lg:flex-row ml-4">
        <Suspense fallback={<Loading />}>
          <div className="flex-grow w-full h-full p-4 lg:h-screen">
            <SubscriptionPage />
          </div>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};

export default Login;
