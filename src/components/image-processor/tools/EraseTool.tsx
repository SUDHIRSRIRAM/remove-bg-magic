import { useState, useRef, useEffect } from 'react';
import { Button } from "../../ui/button";
import { Eraser } from "lucide-react";
import { Slider } from "../../ui/slider";

interface EraseToolProps {
  imageRef: HTMLImageElement | null;
  onImageUpdate: (newImage: string) => void;
}

export const EraseTool = ({ imageRef, onImageUpdate }: EraseToolProps) => {
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!imageRef || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = imageRef.width;
    canvas.height = imageRef.height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = 'destination-out';
    contextRef.current = context;

    context.drawImage(imageRef, 0, 0);
  }, [imageRef]);

  const startErasing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    isDrawing.current = true;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    contextRef.current.lineWidth = brushSize;
  };

  const erase = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopErasing = () => {
    if (!isDrawing.current || !contextRef.current || !canvasRef.current) return;

    contextRef.current.closePath();
    isDrawing.current = false;

    const newImageData = canvasRef.current.toDataURL('image/png');
    onImageUpdate(newImageData);
  };

  return (
    <div className="space-y-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsErasing(!isErasing)}
      >
        <Eraser className="w-4 h-4" /> Erase
      </Button>

      {isErasing && (
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Brush Size: {brushSize}px</label>
          <Slider
            value={[brushSize]}
            onValueChange={([value]) => setBrushSize(value)}
            min={1}
            max={100}
            step={1}
          />
          <canvas
            ref={canvasRef}
            onMouseDown={startErasing}
            onMouseMove={erase}
            onMouseUp={stopErasing}
            onMouseLeave={stopErasing}
            className="border border-gray-200 rounded cursor-crosshair"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};