import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { removeBackground } from "@imgly/background-removal";
import { UploadSection } from "./image-processor/UploadSection";
import { ResultSection } from "./image-processor/ResultSection";
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

      // Convert data URL to Blob
      const base64Data = originalImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const result = await removeBackground(blob, {
        progress: (status: string, progress: number) => {
          setProgress(Math.round(progress * 100));
        },
        model: "isnet",
        debug: true,
        fetchArgs: {
          // Ensure proper URL handling
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        }
      });

      const resultUrl = URL.createObjectURL(result);
      setProcessedImage(resultUrl);
      toast({
        title: "Success!",
        description: "Background removed successfully",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
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
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 gradient-text">
          Image Background Remover
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your image and we'll remove the background instantly
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
        <UploadSection
          originalImage={originalImage}
          isProcessing={isProcessing}
          progress={progress}
          onImageUpload={handleImageUpload}
          onProcess={processImage}
          onDelete={handleDelete}
          handleDrop={handleDrop}
        />
        
        <ResultSection
          processedImage={processedImage}
          onEdit={() => setIsEditorOpen(true)}
          onDownload={handleDownload}
        />
      </div>

      <ImageEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        processedImage={processedImage}
        onImageUpdate={handleImageUpdate}
      />
    </section>
  );
};