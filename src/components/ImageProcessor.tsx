import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { SingleImageTab } from "./image-processor/SingleImageTab";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
        progress: (progress: number) => {
          setProgress(Math.round(progress * 100));
        },
        model: "medium"
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 gradient-text">
            Image Background Remover
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your image and we'll remove the background instantly
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <SingleImageTab
            originalImage={originalImage}
            processedImage={processedImage}
            isProcessing={isProcessing}
            progress={progress}
            onImageUpload={handleImageUpload}
            onProcess={processImage}
            onClear={() => {
              setOriginalImage(null);
              setProcessedImage(null);
            }}
            onDownload={() => {
              if (!processedImage) return;
              const link = document.createElement("a");
              link.href = processedImage;
              link.download = "processed-image.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          />
        </div>
      </div>
    </div>
  );
};