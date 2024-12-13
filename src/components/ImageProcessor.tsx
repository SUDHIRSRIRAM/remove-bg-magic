import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Image as ImageIcon, Upload, FolderOpen, Link2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { ImageUploader } from "./image-processor/ImageUploader";
import { BackgroundOptions } from "./image-processor/BackgroundOptions";
import { ProcessedImage } from "./image-processor/ProcessedImage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    toast({
      title: "Processing multiple images",
      description: `Started processing ${files.length} images`,
    });

    // Process each file
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

    // Process each file in the folder
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
            <div className="max-w-[600px] mx-auto">
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload multiple images for batch processing</h3>
                <p className="text-gray-600 mb-6">Select multiple images to process them all at once</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBulkUpload}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload">
                  <Button asChild>
                    <span>Select Images</span>
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="folder" className="mt-4">
            <div className="max-w-[600px] mx-auto">
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a folder containing images to process</h3>
                <p className="text-gray-600 mb-6">Choose a folder and we'll process all images inside</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFolderUpload}
                  className="hidden"
                  id="folder-upload"
                  {...{ directory: "", webkitdirectory: "" } as any}
                />
                <label htmlFor="folder-upload">
                  <Button asChild>
                    <span>Select Folder</span>
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="max-w-[600px] mx-auto">
              <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Process Image from URL</h3>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleUrlProcess} className="whitespace-nowrap">
                    <Link2 className="w-4 h-4 mr-2" />
                    Process
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
