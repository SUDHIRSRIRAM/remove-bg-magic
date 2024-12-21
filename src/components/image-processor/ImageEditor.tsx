import { useState, useRef, useEffect } from "react";
import { fabric } from 'fabric';
import { Button } from "../ui/button";
import { CropTool } from "./tools/CropTool";
import { EraseTool } from "./tools/EraseTool";
import { FillTool } from "./tools/FillTool";
import { MagicBrush } from "./tools/MagicBrush";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ImageEditorProps {
  processedImage: string;
  onImageUpdate: (newImage: string) => void;
}

export const ImageEditor = ({ processedImage, onImageUpdate }: ImageEditorProps) => {
  const [activeTab, setActiveTab] = useState("tools");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = processedImage;
    img.onload = () => {
      imageRef.current = img;
      
      if (!canvasRef.current) return;
      
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: img.width,
        height: img.height
      });
      
      fabric.Image.fromURL(processedImage, (fabricImg) => {
        if (!fabricRef.current) return;
        fabricRef.current.add(fabricImg);
        fabricRef.current.renderAll();
      });
    };

    return () => {
      fabricRef.current?.dispose();
    };
  }, [processedImage]);

  const handleSave = () => {
    if (!fabricRef.current) return;
    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    onImageUpdate(dataUrl);
  };

  return (
    <div className="space-y-4 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="adjust">Adjust</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <CropTool imageRef={imageRef.current} onImageUpdate={onImageUpdate} />
            <EraseTool fabricCanvas={fabricRef.current} />
            <FillTool fabricCanvas={fabricRef.current} />
            <MagicBrush imageRef={imageRef.current} onImageUpdate={onImageUpdate} />
          </div>
        </TabsContent>

        <TabsContent value="adjust" className="space-y-4">
          {/* Add adjustment controls here */}
        </TabsContent>
      </Tabs>

      <canvas ref={canvasRef} className="w-full rounded-lg border" />

      <Button onClick={handleSave} className="w-full">
        Apply Changes
      </Button>
    </div>
  );
};