"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
