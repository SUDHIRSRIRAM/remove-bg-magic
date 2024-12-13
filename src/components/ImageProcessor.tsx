import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Image as ImageIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { ImageUploader } from "./image-processor/ImageUploader";
import { BackgroundOptions } from "./image-processor/BackgroundOptions";
import { ProcessedImage } from "./image-processor/ProcessedImage";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [quality, setQuality] = useState(100);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setOriginalImage(URL.createObjectURL(file));
    setProcessedImage(null);
  };

  const processImage = async () => {
    if (!originalImage) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const response = await fetch(originalImage);
      const blob = await response.blob();

      const result = await removeBackground(blob, {
        progress: (_: string, current: number, total: number) => {
          setProgress(Math.round((current / total) * 100));
        },
        output: {
          quality: quality / 100,
          format: "image/png"
        }
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          if (selectedBackground !== "transparent") {
            if (selectedBackground === "custom") {
              ctx.fillStyle = customColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (selectedBackground === "image" && customImageUrl) {
              const bgImg = new Image();
              bgImg.onload = () => {
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                setProcessedImage(canvas.toDataURL('image/png', quality / 100));
              };
              bgImg.src = customImageUrl;
              return;
            } else {
              ctx.fillStyle = selectedBackground;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
          
          ctx.drawImage(img, 0, 0);
          setProcessedImage(canvas.toDataURL('image/png', quality / 100));
        }
      };

      img.src = URL.createObjectURL(result);

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

  const downloadImage = async () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `processed-image-hd-${quality}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full max-w-[600px] mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="single" className="text-sm sm:text-base">Single Image</TabsTrigger>
            <TabsTrigger value="bulk" className="text-sm sm:text-base">Bulk Upload</TabsTrigger>
            <TabsTrigger value="folder" className="text-sm sm:text-base">Folder Upload</TabsTrigger>
            <TabsTrigger value="url" className="text-sm sm:text-base">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
              <div className="space-y-6">
                <ImageUploader
                  originalImage={originalImage}
                  isProcessing={isProcessing}
                  progress={progress}
                  onImageUpload={handleImageUpload}
                  onProcess={processImage}
                  onClear={clearImage}
                />
              </div>

              <div className="space-y-8">
                <BackgroundOptions
                  selectedBackground={selectedBackground}
                  customColor={customColor}
                  customImageUrl={customImageUrl}
                  onBackgroundChange={setSelectedBackground}
                  onCustomColorChange={setCustomColor}
                  onCustomImageUrlChange={setCustomImageUrl}
                />

                <ProcessedImage
                  processedImage={processedImage}
                  onDownload={downloadImage}
                  quality={quality}
                  onQualityChange={setQuality}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Bulk upload coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="folder" className="mt-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Folder upload coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Image URL processing coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};