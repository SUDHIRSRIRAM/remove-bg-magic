import { useState, useRef } from "react";
import { Slider } from "../ui/slider";
import { CropTool } from "./tools/CropTool";
import { EraseTool } from "./tools/EraseTool";
import { FillTool } from "./tools/FillTool";
import { MagicBrush } from "./tools/MagicBrush";

interface ImageEditorProps {
  processedImage: string;
  onImageUpdate: (newImage: string) => void;
}

export const ImageEditor = ({ processedImage, onImageUpdate }: ImageEditorProps) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    if (!imageRef.current) return;
    imageRef.current.style.filter = `brightness(${value}%) contrast(${contrast}%)`;
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    if (!imageRef.current) return;
    imageRef.current.style.filter = `brightness(${brightness}%) contrast(${value}%)`;
  };

  return (
    <div className="space-y-4 w-full">
      <img
        ref={imageRef}
        src={processedImage}
        alt="Processed"
        className="processed-image max-h-[400px] mx-auto rounded-lg object-contain bg-transparent"
        style={{ 
          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          backgroundColor: 'transparent'
        }}
      />
      
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <CropTool imageRef={imageRef.current} onImageUpdate={onImageUpdate} />
        <EraseTool imageRef={imageRef.current} onImageUpdate={onImageUpdate} />
        <FillTool imageRef={imageRef.current} onImageUpdate={onImageUpdate} />
        <MagicBrush imageRef={imageRef.current} onImageUpdate={onImageUpdate} />
      </div>

      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Brightness</label>
          <Slider
            value={[brightness]}
            onValueChange={([value]) => handleBrightnessChange(value)}
            min={0}
            max={200}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Contrast</label>
          <Slider
            value={[contrast]}
            onValueChange={([value]) => handleContrastChange(value)}
            min={0}
            max={200}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};