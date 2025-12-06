"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageCropModal } from "./ImageCropModal";
import { Skeleton } from "./skeleton"; // Import the new component
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  aspect = 1,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset loading state when the image URL changes
  useEffect(() => {
    if (value) {
      setIsImageLoading(true);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    
    e.target.value = "";
  };

  const handleUploadCroppedImage = async (blob: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", blob, "cropped-image.png");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setImageToCrop(null);
    }
  };
  
  const handleRemove = () => {
    onChange("");
  };

  const handleModalClose = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
  }

  return (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>

      {imageToCrop && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={handleModalClose}
          imageSrc={imageToCrop}
          onSave={handleUploadCroppedImage}
          aspect={aspect}
        />
      )}

      {value ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden border border-border group bg-muted">
          {isImageLoading && <Skeleton className="w-full h-full" />}
          <Image
            src={value}
            alt="Upload preview"
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Click to upload
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    SVG, PNG, JPG or GIF (max. 4MB)
                  </p>
                </>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}