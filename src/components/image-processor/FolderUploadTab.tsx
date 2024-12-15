import { FolderOpen } from "lucide-react";
import { Button } from "../ui/button";

interface FolderUploadTabProps {
  onFolderUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FolderUploadTab = ({ onFolderUpload }: FolderUploadTabProps) => {
  return (
    <div className="max-w-[600px] mx-auto">
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300">
        <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select a folder containing images to process</h3>
        <p className="text-gray-600 mb-6">Choose a folder and we'll process all images inside</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFolderUpload}
          className="hidden"
          id="folder-upload"
          {...{ directory: "", webkitdirectory: "" } as any}
        />
        <label htmlFor="folder-upload">
          <Button asChild className="w-full sm:w-auto">
            <span>Select Folder</span>
          </Button>
        </label>
      </div>
    </div>
  );
};