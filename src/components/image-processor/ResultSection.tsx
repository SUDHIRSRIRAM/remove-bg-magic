import { Download, Edit } from "lucide-react";
import { Button } from "../ui/button";

interface ResultSectionProps {
  processedImage: string | null;
  onEdit: () => void;
  onDownload: () => void;
}

export const ResultSection = ({
  processedImage,
  onEdit,
  onDownload,
}: ResultSectionProps) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-6 text-center min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center">
      {processedImage ? (
        <div className="space-y-4 w-full">
          <img
            src={processedImage}
            alt="Processed"
            className="max-h-[300px] mx-auto rounded-lg object-contain"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onEdit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Edit className="h-4 w-4 sm:mr-2" />
              <span>Edit Image</span>
            </Button>
            <Button
              onClick={onDownload}
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
  );
};