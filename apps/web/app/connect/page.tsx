import * as React from "react";
import { Loader2 } from "lucide-react";
import { ConnectClient } from "@/components/connect/ConnectClient";

export const metadata = {
  title: "Connect Wallet — GuardFi AI",
};

export default function ConnectPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <ConnectClient />
    </React.Suspense>
  );
}
