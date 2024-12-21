import { useState } from "react";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

interface ImageAdjustmentsProps {
  processedImage: string;
  onImageUpdate: (newImage: string) => void;
}

export const ImageAdjustments = ({ processedImage, onImageUpdate }: ImageAdjustmentsProps) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const handleAdjustment = (type: string, value: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, 0, 0);
        onImageUpdate(canvas.toDataURL('image/png'));
      }
    };
    
    img.src = processedImage;
    
    switch (type) {
      case 'brightness':
        setBrightness(value);
        break;
      case 'contrast':
        setContrast(value);
        break;
      case 'saturation':
        setSaturation(value);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Brightness</Label>
          <Slider
            value={[brightness]}
            onValueChange={([value]) => handleAdjustment('brightness', value)}
            min={0}
            max={200}
            step={1}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Contrast</Label>
          <Slider
            value={[contrast]}
            onValueChange={([value]) => handleAdjustment('contrast', value)}
            min={0}
            max={200}
            step={1}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Saturation</Label>
          <Slider
            value={[saturation]}
            onValueChange={([value]) => handleAdjustment('saturation', value)}
            min={0}
            max={200}
            step={1}
          />
        </div>
      </div>
      
      <div className="relative aspect-video w-full border rounded-lg overflow-hidden bg-gray-50">
        <img
          src={processedImage}
          alt="Adjustments preview"
          className="w-full h-full object-contain"
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
          }}
        />
      </div>
    </div>
  );
};