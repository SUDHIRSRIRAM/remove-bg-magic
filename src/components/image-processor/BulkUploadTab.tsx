import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface BulkUploadTabProps {
  onBulkUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BulkUploadTab = ({ onBulkUpload }: BulkUploadTabProps) => {
  const { toast } = useToast();

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload multiple images for batch processing</h3>
        <p className="text-gray-600 mb-6">Select multiple images to process them all at once</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onBulkUpload}
          className="hidden"
          id="bulk-upload"
        />
        <label htmlFor="bulk-upload">
          <Button asChild className="w-full sm:w-auto">
            <span>Select Images</span>
          </Button>
        </label>
      </div>
    </div>
  );
};