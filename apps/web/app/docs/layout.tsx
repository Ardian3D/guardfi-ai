import * as React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocPager } from "@/components/docs/DocPager";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer className="py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <DocsSidebar />

        <div className="min-w-0 max-w-3xl">
          {children}
          <DocPager />
        </div>
      </div>
    </PageContainer>
  );
}
