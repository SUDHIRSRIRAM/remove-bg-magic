import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { Trash2, Upload, Download, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ImageEditorDialog } from "./image-processor/ImageEditorDialog";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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

  const handleImageUpdate = (newImage: string) => {
    setProcessedImage(newImage);
    setIsEditorOpen(false);
    toast({
      title: "Image Updated",
      description: "Changes have been applied successfully",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 gradient-text">
          Image Background Remover
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your image and we'll remove the background instantly
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-8 text-center transition-all duration-300 hover:border-primary/50"
          >
            {originalImage ? (
              <div className="space-y-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-[300px] sm:max-h-[400px] mx-auto rounded-lg object-contain"
                />
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
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
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
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
                  className="cursor-pointer block p-4 sm:p-8"
                >
                  <Upload className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-4" />
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
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-8 text-center min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center">
            {processedImage ? (
              <div className="space-y-4 w-full">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-[300px] sm:max-h-[400px] mx-auto rounded-lg object-contain"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span>Edit Image</span>
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">
                Processed image will appear here
              </p>
            )}
          </div>
        </div>
      </div>

      <ImageEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        processedImage={processedImage}
        onImageUpdate={(newImage) => {
          setProcessedImage(newImage);
          setIsEditorOpen(false);
          toast({
            title: "Image Updated",
            description: "Changes have been applied successfully",
          });
        }}
      />
    </div>
  );
};