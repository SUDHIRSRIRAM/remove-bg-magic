import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Image as ImageIcon, Upload, Download } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { removeBackground, loadImage } from "@/lib/background-removal";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";

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
      setProgress(0);

      const img = await loadImage(await fetch(originalImage).then(r => r.blob()));
      const result = await removeBackground(img);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const processedImg = new Image();

      processedImg.onload = () => {
        if (!ctx) return;
        canvas.width = processedImg.width;
        canvas.height = processedImg.height;

        if (selectedBackground !== "transparent") {
          if (selectedBackground === "custom") {
            ctx.fillStyle = customColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (selectedBackground === "image" && customImageUrl) {
            const bgImg = new Image();
            bgImg.onload = () => {
              ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
              ctx.drawImage(processedImg, 0, 0);
              setProcessedImage(canvas.toDataURL('image/png', quality / 100));
            };
            bgImg.src = customImageUrl;
            return;
          } else {
            ctx.fillStyle = selectedBackground;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        
        ctx.drawImage(processedImg, 0, 0);
        setProcessedImage(canvas.toDataURL('image/png', quality / 100));
      };

      processedImg.src = URL.createObjectURL(result);

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

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full max-w-[600px] mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="single">Single Image</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            <TabsTrigger value="folder">Folder Upload</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
              {/* Upload Section */}
              <div className="space-y-4">
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
                        onClick={processImage}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <div className="w-full">
                            <div className="flex items-center justify-center mb-2">
                              Processing...
                            </div>
                            <Progress value={progress} className="w-full" />
                          </div>
                        ) : (
                          "Remove Background"
                        )}
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

                {/* Background Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Choose Background</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["transparent", "white", "black", "#ff4444", "#4444ff", "#44ff44"].map((color) => (
                      <Button
                        key={color}
                        variant={selectedBackground === color ? "default" : "outline"}
                        onClick={() => setSelectedBackground(color)}
                        className="h-20"
                        style={{
                          backgroundColor: color === "transparent" ? "transparent" : color,
                          border: color === "transparent" ? "2px dashed #ccc" : undefined
                        }}
                      >
                        {color === "transparent" ? "Transparent" : ""}
                      </Button>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Custom Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setSelectedBackground("custom");
                        }}
                        className="h-10 w-20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Custom Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={customImageUrl}
                        onChange={(e) => {
                          setCustomImageUrl(e.target.value);
                          setSelectedBackground("image");
                        }}
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Section */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                {processedImage ? (
                  <div>
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="max-h-[400px] mx-auto mb-4"
                    />
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium min-w-[80px]">
                          Quality: {quality}%
                        </span>
                        <Slider
                          value={[quality]}
                          onValueChange={(values) => setQuality(values[0])}
                          min={1}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                      <Button onClick={downloadImage} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download HD
                      </Button>
                    </div>
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
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Bulk upload coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="folder" className="mt-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Folder upload coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Image URL processing coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};