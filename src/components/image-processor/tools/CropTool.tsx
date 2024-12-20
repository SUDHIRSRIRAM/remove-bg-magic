import { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "../../ui/button";
import { Crop as CropIcon } from "lucide-react";

interface CropToolProps {
  imageRef: HTMLImageElement | null;
  onImageUpdate: (newImage: string) => void;
}

export const CropTool = ({ imageRef, onImageUpdate }: CropToolProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [isCropping, setIsCropping] = useState(false);

  const applyCrop = () => {
    if (!imageRef || !crop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    onImageUpdate(canvas.toDataURL('image/png'));
    setIsCropping(false);
  };

  return (
    <div className="space-y-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsCropping(!isCropping)}
      >
        <CropIcon className="w-4 h-4" /> Crop
      </Button>

      {isCropping && imageRef && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
              <img src={imageRef.src} alt="Crop preview" />
            </ReactCrop>
            <div className="flex gap-2 mt-4">
              <Button onClick={applyCrop}>Apply Crop</Button>
              <Button variant="outline" onClick={() => setIsCropping(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};