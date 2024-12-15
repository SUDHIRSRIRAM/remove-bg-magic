import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Image as ImageIcon, Upload, FolderOpen, Link2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { SingleImageTab } from "./image-processor/SingleImageTab";
import { BulkUploadTab } from "./image-processor/BulkUploadTab";
import { FolderUploadTab } from "./image-processor/FolderUploadTab";
import { ImageUrlTab } from "./image-processor/ImageUrlTab";

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
        progress: (progress: number) => {
          setProgress(progress);
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
    link.download = `processed-image-${quality}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    toast({
      title: "Processing multiple images",
      description: `Started processing ${files.length} images`,
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      handleImageUpload(file);
      await processImage();
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    toast({
      title: "Processing folder",
      description: `Started processing ${files.length} images from folder`,
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      handleImageUpload(file);
      await processImage();
    }
  };

  const handleUrlProcess = async () => {
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
  };

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="w-full max-w-[600px] mx-auto mb-8 p-1 bg-white border rounded-lg shadow-sm">
            <TabsTrigger 
              value="single" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Single Image
            </TabsTrigger>
            <TabsTrigger 
              value="bulk" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger 
              value="folder" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Folder Upload
            </TabsTrigger>
            <TabsTrigger 
              value="url" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Image URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
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
              onClear={clearImage}
              onBackgroundChange={setSelectedBackground}
              onCustomColorChange={setCustomColor}
              onCustomImageUrlChange={setCustomImageUrl}
              onQualityChange={setQuality}
              onDownload={downloadImage}
            />
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <BulkUploadTab onBulkUpload={handleBulkUpload} />
          </TabsContent>

          <TabsContent value="folder" className="mt-4">
            <FolderUploadTab onFolderUpload={handleFolderUpload} />
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <ImageUrlTab
              imageUrl={imageUrl}
              onImageUrlChange={setImageUrl}
              onUrlProcess={handleUrlProcess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};