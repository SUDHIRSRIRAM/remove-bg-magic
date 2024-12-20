import { useState } from 'react';
import { Button } from "../../ui/button";
import { PaintBucket } from "lucide-react";
import { HexColorPicker } from "react-colorful";

interface FillToolProps {
  imageRef: HTMLImageElement | null;
  onImageUpdate: (newImage: string) => void;
}

export const FillTool = ({ imageRef, onImageUpdate }: FillToolProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#ffffff");

  const applyFill = () => {
    if (!imageRef) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imageRef.width;
    canvas.height = imageRef.height;

    // Fill background with selected color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image on top
    ctx.drawImage(imageRef, 0, 0);

    onImageUpdate(canvas.toDataURL('image/png'));
    setShowColorPicker(false);
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <PaintBucket className="w-4 h-4" /> Fill
      </Button>

      {showColorPicker && (
        <div className="absolute z-10 mt-2 bg-white p-4 rounded-lg shadow-lg">
          <HexColorPicker color={color} onChange={setColor} />
          <div className="flex gap-2 mt-4">
            <Button onClick={applyFill}>Apply</Button>
            <Button variant="outline" onClick={() => setShowColorPicker(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};