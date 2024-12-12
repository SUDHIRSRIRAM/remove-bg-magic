import { Download } from "lucide-react";
import { Button } from "../ui/button";

interface ProcessedImageProps {
  processedImage: string | null;
  onDownload: () => void;
}

export const ProcessedImage = ({ processedImage, onDownload }: ProcessedImageProps) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
      {processedImage ? (
        <div>
          <img
            src={processedImage}
            alt="Processed"
            className="max-h-[400px] mx-auto mb-4"
          />
          <Button onClick={onDownload} className="w-full">
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
  );
};