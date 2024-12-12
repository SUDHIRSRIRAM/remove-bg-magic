import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Image as ImageIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";
import backgroundRemoval from "@imgly/background-removal";
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

      const result = await backgroundRemoval(blob, {
        progress: (progress) => {
          setProgress(Math.round(progress * 100));
        },
        background: selectedBackground === "transparent" ? undefined : {
          color: selectedBackground === "custom" ? customColor : selectedBackground,
          image: selectedBackground === "image" ? customImageUrl : undefined,
        },
      });

      setProcessedImage(URL.createObjectURL(result));
      toast({
        title: "Success!",
        description: "Background removed successfully",
      });
    } catch (error) {
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

    const a = document.createElement("a");
    a.href = processedImage;
    a.download = "processed-image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="single">Single Image</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            <TabsTrigger value="folder">Folder Upload</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8">
              <ImageUploader
                originalImage={originalImage}
                isProcessing={isProcessing}
                progress={progress}
                onImageUpload={handleImageUpload}
                onProcess={processImage}
                onClear={clearImage}
              />

              <div>
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
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <div className="text-center p-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>Bulk upload coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="folder" className="mt-4">
            <div className="text-center p-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>Folder upload coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="text-center p-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>Image URL processing coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};