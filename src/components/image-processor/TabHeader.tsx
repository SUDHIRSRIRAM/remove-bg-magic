import { ImageIcon, Upload, FolderOpen, Link2 } from "lucide-react";
import { TabsTrigger } from "../ui/tabs";

export const TabHeader = () => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <TabsTrigger 
        value="single" 
        className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all hover:bg-gray-50"
      >
        <ImageIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Single</span>
      </TabsTrigger>
      <TabsTrigger 
        value="bulk" 
        className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all hover:bg-gray-50"
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm font-medium">Bulk</span>
      </TabsTrigger>
      <TabsTrigger 
        value="folder" 
        className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all hover:bg-gray-50"
      >
        <FolderOpen className="w-4 h-4" />
        <span className="text-sm font-medium">Folder</span>
      </TabsTrigger>
      <TabsTrigger 
        value="url" 
        className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all hover:bg-gray-50"
      >
        <Link2 className="w-4 h-4" />
        <span className="text-sm font-medium">URL</span>
      </TabsTrigger>
    </div>
  );
};