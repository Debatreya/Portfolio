"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getImagesFromFolder } from "@/lib/actions";

export function ProfileGallery({
  folder,
  fallbackInitials,
}: {
  folder: string;
  fallbackInitials?: string;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getImagesFromFolder(folder).then((data) => {
      if (data && data.length > 0) {
        setImages(data);
      }
    });
  }, [folder]);

  // Rotate images every 3 seconds
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      if (!isOpen) {
        setRotationIndex((prev) => (prev + 1) % images.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, images.length]);

  const handlePrevious = () => {
    setGalleryIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setGalleryIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    if (fallbackInitials) {
      return (
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted">
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-3xl font-bold">
            {fallbackInitials}
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-32 h-32 rounded-full border-2 border-muted bg-muted animate-pulse" />
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setGalleryIndex(rotationIndex);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted focus:outline-none focus:ring-2 focus:ring-ring hover:scale-105 transition-transform duration-300 group cursor-pointer"
        >
          <Image
            src={images[rotationIndex]}
            alt="Profile"
            fill
            className="object-cover transition-opacity duration-500"
            priority
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-xs font-medium tracking-wider uppercase">
              View Gallery
            </span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 outline-none">
        <DialogTitle className="sr-only">Image Gallery</DialogTitle>
        <div className="relative flex items-center justify-center w-full h-[85vh]">
          {/* Main Image */}
          <div className="relative w-full h-full max-h-full">
            <Image
              src={images[galleryIndex]}
              alt={`Gallery image ${galleryIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Controls */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 sm:-left-12 p-3 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring border shadow-sm backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:-right-12 p-3 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring border shadow-sm backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((imgUrl, idx) => (
              <button
                key={imgUrl}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                  idx === galleryIndex
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/50 hover:bg-muted-foreground"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
