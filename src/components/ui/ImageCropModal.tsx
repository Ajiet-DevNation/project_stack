"use client";

import { useState, useRef } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (blob: Blob) => void;
  aspect?: number;
}

// Function to generate the cropped image
function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string,
  rotation = 0
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scale = 1;
  canvas.width = Math.floor(crop.width * scaleX * scale);
  canvas.height = Math.floor(crop.height * scaleY * scale);

  ctx.save();
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  
  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );
  
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      // You can also pass the original file name to the new File object
      const file = new File([blob], fileName, { type: "image/png" });
      resolve(file);
    }, "image/png");
  });
}


export function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  aspect = 1,
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [rotation, setRotation] = useState(0);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  }

  async function handleSaveCrop() {
    if (imgRef.current && crop?.width && crop?.height) {
      try {
        const croppedBlob = await getCroppedImg(imgRef.current, crop, "cropped-image.png", rotation);
        onSave(croppedBlob);
        onClose();
      } catch (e) {
        console.error("Error cropping image:", e);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={aspect}
            className="w-full"
          >
            <img 
              ref={imgRef}
              src={imageSrc} 
              onLoad={onImageLoad} 
              alt="Crop preview" 
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-h-[60vh]"
            />
          </ReactCrop>
          <div className="w-full space-y-2 px-4">
            <label className="text-sm font-medium">Rotate</label>
            <div className="flex items-center gap-4">
              <Slider
                min={-180}
                max={180}
                step={1}
                value={[rotation]}
                onValueChange={(value) => setRotation(value[0])}
                className="w-full"
              />
               <Button variant="outline" size="icon" onClick={() => setRotation(r => (r + 90) % 360)}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveCrop}>Save and Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
