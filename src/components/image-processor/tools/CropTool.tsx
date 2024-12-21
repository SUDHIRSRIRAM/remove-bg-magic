import { useState } from 'react';
import { Crop } from 'lucide-react';
import { Button } from '../../ui/button';
import ReactCrop, { Crop as CropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropToolProps {
  imageRef: HTMLImageElement | null;
  onImageUpdate: (newImage: string) => void;
}

export const CropTool = ({ imageRef, onImageUpdate }: CropToolProps) => {
  const [crop, setCrop] = useState<CropType>();
  const [isActive, setIsActive] = useState(false);

  const handleCropComplete = (crop: CropType) => {
    if (!imageRef || !crop.width || !crop.height) return;

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
    setIsActive(false);
  };

  return (
    <div>
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={() => setIsActive(!isActive)}
        className="flex items-center gap-2"
      >
        <Crop className="w-4 h-4" /> Crop
      </Button>

      {isActive && imageRef && (
        <ReactCrop
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={handleCropComplete}
        >
          <img src={imageRef.src} alt="Crop preview" />
        </ReactCrop>
      )}
    </div>
  );
};