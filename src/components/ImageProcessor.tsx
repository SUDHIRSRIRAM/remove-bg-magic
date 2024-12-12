import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Upload, Download, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { backgroundRemoval } from "@imgly/background-removal";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";

export const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [customImageUrl, setCustomImageUrl] = useState("");
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

    // Compress image before processing
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    });

    setOriginalImage(URL.createObjectURL(compressedFile));
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
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => processImage()}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            Processing...
                            <Progress value={progress} className="w-full mt-2" />
                          </>
                        ) : (
                          "Remove Background"
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={clearImage}
                        className="px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

              <div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Choose Background</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Button
                      variant={selectedBackground === "transparent" ? "default" : "outline"}
                      onClick={() => setSelectedBackground("transparent")}
                      className="h-20"
                    >
                      Transparent
                    </Button>
                    <Button
                      variant={selectedBackground === "white" ? "default" : "outline"}
                      onClick={() => setSelectedBackground("white")}
                      className="h-20 bg-white"
                    >
                      White
                    </Button>
                    <Button
                      variant={selectedBackground === "black" ? "default" : "outline"}
                      onClick={() => setSelectedBackground("black")}
                      className="h-20 bg-black"
                    >
                      Black
                    </Button>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="custom-color">Custom Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="custom-color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setSelectedBackground("custom");
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom-image">Custom Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        id="custom-image"
                        placeholder="https://example.com/image.jpg"
                        value={customImageUrl}
                        onChange={(e) => {
                          setCustomImageUrl(e.target.value);
                          setSelectedBackground("image");
                        }}
                      />
                    </div>
                  </div>
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