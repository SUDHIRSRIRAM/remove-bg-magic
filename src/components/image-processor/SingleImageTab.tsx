import { ImageIcon } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { BackgroundOptions } from "./BackgroundOptions";
import { ProcessedImage } from "./ProcessedImage";

interface SingleImageTabProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  progress: number;
  selectedBackground: string;
  customColor: string;
  customImageUrl: string;
  quality: number;
  onImageUpload: (file: File) => void;
  onProcess: () => void;
  onClear: () => void;
  onBackgroundChange: (type: string) => void;
  onCustomColorChange: (color: string) => void;
  onCustomImageUrlChange: (url: string) => void;
  onQualityChange: (value: number) => void;
  onDownload: () => void;
}

export const SingleImageTab = ({
  originalImage,
  processedImage,
  isProcessing,
  progress,
  selectedBackground,
  customColor,
  customImageUrl,
  quality,
  onImageUpload,
  onProcess,
  onClear,
  onBackgroundChange,
  onCustomColorChange,
  onCustomImageUrlChange,
  onQualityChange,
  onDownload,
}: SingleImageTabProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
      <div className="space-y-6">
        <ImageUploader
          originalImage={originalImage}
          isProcessing={isProcessing}
          progress={progress}
          onImageUpload={onImageUpload}
          onProcess={onProcess}
          onClear={onClear}
        />
      </div>

      <div className="space-y-8">
        <BackgroundOptions
          selectedBackground={selectedBackground}
          customColor={customColor}
          customImageUrl={customImageUrl}
          onBackgroundChange={onBackgroundChange}
          onCustomColorChange={onCustomColorChange}
          onCustomImageUrlChange={onCustomImageUrlChange}
        />

        <ProcessedImage
          processedImage={processedImage}
          onDownload={onDownload}
          quality={quality}
          onQualityChange={onQualityChange}
        />
      </div>
    </div>
  );
};