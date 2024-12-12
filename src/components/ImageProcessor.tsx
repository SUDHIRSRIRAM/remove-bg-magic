import { useState } from "react";
import { Button } from "./ui/button";
import { Upload, Download } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { loadImage, removeBackground } from "../lib/background-removal";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setOriginalImage(URL.createObjectURL(file));
    setProcessedImage(null);
  };

  const processImage = async () => {
    if (!originalImage) return;

    try {
      setIsProcessing(true);
      const img = await loadImage(await fetch(originalImage).then(r => r.blob()));
      const processedBlob = await removeBackground(img);
      setProcessedImage(URL.createObjectURL(processedBlob));
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

  return (
    <div id="upload-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            {originalImage ? (
              <div>
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-[400px] mx-auto mb-4"
                />
                <Button
                  onClick={() => processImage()}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Remove Background"}
                </Button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="cursor-pointer block p-8"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Click or drag image to upload
                </p>
              </label>
            )}
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            {processedImage ? (
              <div>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-[400px] mx-auto mb-4"
                />
                <Button onClick={downloadImage} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">
                  Processed image will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};