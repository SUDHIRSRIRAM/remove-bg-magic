import { ImageIcon, Upload, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface SingleImageTabProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  progress: number;
  onImageUpload: (file: File) => void;
  onProcess: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export const SingleImageTab = ({
  originalImage,
  processedImage,
  isProcessing,
  progress,
  onImageUpload,
  onProcess,
  onClear,
  onDownload,
}: SingleImageTabProps) => {
  return (
    <>
      {/* Original Image Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upload Image</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
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
          
          {originalImage ? (
            <div className="space-y-4">
              <img
                src={originalImage}
                alt="Original"
                className="max-h-[300px] mx-auto object-contain"
              />
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={onProcess}
                  disabled={isProcessing}
                  className="w-full max-w-xs"
                >
                  {isProcessing ? (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span>Processing...</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  ) : (
                    "Remove Background"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-4"
            >
              <ImageIcon className="w-16 h-16 text-gray-400" />
              <p className="text-gray-600 text-center">
                Drag and drop your image here, or click to select
              </p>
              <Button variant="secondary" className="mt-4">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </label>
          )}
        </div>
      </div>

      {/* Processed Image Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Result</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
          {processedImage ? (
            <div className="space-y-4">
              <img
                src={processedImage}
                alt="Processed"
                className="max-h-[300px] mx-auto object-contain"
              />
              <Button 
                onClick={onDownload} 
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Result
              </Button>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-16 h-16 mb-4" />
              <p>Your processed image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};