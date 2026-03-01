"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export function ProjectModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0c0d0e] border-white/5">
        <DialogTitle className="sr-only">Project Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed view of the project
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
