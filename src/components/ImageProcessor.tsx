import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { SingleImageTab } from "./image-processor/SingleImageTab";
import { Trash2, Upload, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDelete = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProgress(0);
    toast({
      title: "Deleted",
      description: "Image has been removed",
    });
  };

  const processImage = async () => {
    if (!originalImage) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const response = await fetch(originalImage);
      const blob = await response.blob();

      const result = await removeBackground(blob, {
        progress: (args_0: string, args_1: number) => {
          setProgress(Math.round(args_1 * 100));
        },
        model: "isnet"
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

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Downloaded",
      description: "Image has been saved",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 gradient-text">
          Image Background Remover
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your image and we'll remove the background instantly
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center transition-all duration-300 hover:border-primary/50"
          >
            {originalImage ? (
              <div className="space-y-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-[400px] mx-auto rounded-lg object-contain"
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {isProcessing ? (
                      <div className="w-full space-y-2">
                        <span>Processing... {progress}%</span>
                        <Progress value={progress} className="w-full" />
                      </div>
                    ) : (
                      "Remove Background"
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block p-8"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports JPG, PNG and WEBP
                  </p>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
            {processedImage ? (
              <div className="space-y-4 w-full">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-[400px] mx-auto rounded-lg object-contain"
                />
                <Button
                  onClick={handleDownload}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Result
                </Button>
              </div>
            ) : (
              <p className="text-gray-400">
                Processed image will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};