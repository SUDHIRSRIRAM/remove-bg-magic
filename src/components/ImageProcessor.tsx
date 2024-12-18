import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SingleImageTab } from "./image-processor/SingleImageTab";
import { ComparisonSlider } from "./image-processor/ComparisonSlider";
import { ImageAdjustments } from "./image-processor/ImageAdjustments";
import { DownloadOptions } from "./image-processor/DownloadOptions";
import { UrlInput } from "./image-processor/UrlInput";
import { applyImageAdjustments, convertToFormat, loadImageFromUrl } from "@/utils/imageProcessing";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string);
        setProcessedImage(null);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (url: string) => {
    try {
      setIsProcessing(true);
      const img = await loadImageFromUrl(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setOriginalImage(canvas.toDataURL());
        setProcessedImage(null);
        toast({
          title: "Success",
          description: "Image loaded from URL successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load image from URL",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async () => {
    if (!originalImage) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const response = await fetch(originalImage);
      const blob = await response.blob();

      const result = await removeBackground(blob, {
        progress: (_: string, progress: number) => {
          setProgress(Math.round(progress * 100));
        },
      });

      setProcessedImage(URL.createObjectURL(result));
      toast({
        title: "Success!",
        description: "Background removed successfully",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = async (format: string) => {
    if (!processedImage) return;

    try {
      const img = await loadImageFromUrl(processedImage);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const adjustedCanvas = applyImageAdjustments(canvas, brightness, contrast);
        const blob = await convertToFormat(adjustedCanvas, format);
        
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `processed-image.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Downloaded",
          description: "Image has been saved",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Image Background Remover
        </h1>
        <p className="text-lg text-gray-600">
          Upload your image and we'll remove the background instantly
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="single">Single Image</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <SingleImageTab
            originalImage={originalImage}
            processedImage={processedImage}
            isProcessing={isProcessing}
            progress={progress}
            onImageUpload={handleImageUpload}
            onProcess={processImage}
            onDownload={handleDownload}
          />
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <UrlInput onUrlSubmit={handleUrlSubmit} />
        </TabsContent>
      </Tabs>

      {originalImage && processedImage && (
        <div className="space-y-6">
          <ComparisonSlider
            originalImage={originalImage}
            processedImage={processedImage}
          />
          
          <div className="grid md:grid-cols-2 gap-4">
            <ImageAdjustments
              brightness={brightness}
              contrast={contrast}
              onBrightnessChange={setBrightness}
              onContrastChange={setContrast}
            />
            
            <div className="flex items-center justify-end">
              <DownloadOptions onDownload={handleDownload} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};