import { useState } from "react";
import { Tabs, TabsContent, TabsList } from "./ui/tabs";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { SingleImageTab } from "./image-processor/SingleImageTab";
import { BulkUploadTab } from "./image-processor/BulkUploadTab";
import { FolderUploadTab } from "./image-processor/FolderUploadTab";
import { ImageUrlTab } from "./image-processor/ImageUrlTab";
import { TabHeader } from "./image-processor/TabHeader";
import { ProgressHandler } from "./image-processor/ProgressHandler";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [quality, setQuality] = useState(100);
  const [imageUrl, setImageUrl] = useState("");
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
        progress: (p: number) => {
          setProgress(Math.round(p * 100));
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
        if (!canvas || !ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="single" className="w-full space-y-4 sm:space-y-8">
          <TabsList className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border rounded-lg p-2 sticky top-0 z-10">
            <TabHeader />
          </TabsList>

          <div className="max-w-3xl mx-auto w-full space-y-4">
            <ProgressHandler isProcessing={isProcessing} progress={progress} />
            
            <TabsContent value="single" className="mt-2 sm:mt-4 space-y-4">
              <SingleImageTab
                originalImage={originalImage}
                processedImage={processedImage}
                isProcessing={isProcessing}
                progress={progress}
                selectedBackground={selectedBackground}
                customColor={customColor}
                customImageUrl={customImageUrl}
                quality={quality}
                onImageUpload={handleImageUpload}
                onProcess={processImage}
                onClear={() => {
                  setOriginalImage(null);
                  setProcessedImage(null);
                }}
                onBackgroundChange={setSelectedBackground}
                onCustomColorChange={setCustomColor}
                onCustomImageUrlChange={setCustomImageUrl}
                onQualityChange={setQuality}
                onDownload={() => {
                  if (!processedImage) return;
                  const link = document.createElement("a");
                  link.href = processedImage;
                  link.download = `processed-image-${quality}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            </TabsContent>

            <TabsContent value="bulk" className="mt-2 sm:mt-4">
              <BulkUploadTab onBulkUpload={async (e) => {
                const files = e.target.files;
                if (!files) return;
                
                toast({
                  title: "Processing multiple images",
                  description: `Started processing ${files.length} images`,
                });

                for (let i = 0; i < files.length; i++) {
                  handleImageUpload(files[i]);
                  await processImage();
                }
              }} />
            </TabsContent>

            <TabsContent value="folder" className="mt-2 sm:mt-4">
              <FolderUploadTab onFolderUpload={async (e) => {
                const files = e.target.files;
                if (!files) return;

                toast({
                  title: "Processing folder",
                  description: `Started processing ${files.length} images from folder`,
                });

                for (let i = 0; i < files.length; i++) {
                  handleImageUpload(files[i]);
                  await processImage();
                }
              }} />
            </TabsContent>

            <TabsContent value="url" className="mt-2 sm:mt-4">
              <ImageUrlTab
                imageUrl={imageUrl}
                onImageUrlChange={setImageUrl}
                onUrlProcess={async () => {
                  if (!imageUrl) {
                    toast({
                      title: "Error",
                      description: "Please enter an image URL",
                      variant: "destructive",
                    });
                    return;
                  }

                  try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const file = new File([blob], "image.png", { type: blob.type });
                    handleImageUpload(file);
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to load image from URL",
                      variant: "destructive",
                    });
                  }
                }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};