import { Upload, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface UploadSectionProps {
  originalImage: string | null;
  isProcessing: boolean;
  progress: number;
  onImageUpload: (file: File) => void;
  onProcess: () => void;
  onDelete: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const UploadSection = ({
  originalImage,
  isProcessing,
  progress,
  onImageUpload,
  onProcess,
  onDelete,
  handleDrop,
}: UploadSectionProps) => {
  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-6 text-center transition-all duration-300 hover:border-primary/50 min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center"
    >
      {originalImage ? (
        <div className="space-y-4 w-full">
          <img
            src={originalImage}
            alt="Original"
            className="max-h-[300px] mx-auto rounded-lg object-contain"
          />
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              onClick={onProcess}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
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
              onClick={onDelete}
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
              if (file) onImageUpload(file);
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer block p-4 sm:p-6"
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
  );
};