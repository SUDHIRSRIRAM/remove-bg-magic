import { ImageIcon, Upload, FolderOpen, Link2 } from "lucide-react";
import { TabsTrigger } from "../ui/tabs";

export const TabHeader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
      <TabsTrigger 
        value="single" 
        className="flex items-center justify-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
      >
        <ImageIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Single Image</span>
        <span className="sm:hidden">Single</span>
      </TabsTrigger>
      <TabsTrigger 
        value="bulk" 
        className="flex items-center justify-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Bulk Upload</span>
        <span className="sm:hidden">Bulk</span>
      </TabsTrigger>
      <TabsTrigger 
        value="folder" 
        className="flex items-center justify-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
      >
        <FolderOpen className="w-4 h-4" />
        <span className="hidden sm:inline">Folder Upload</span>
        <span className="sm:hidden">Folder</span>
      </TabsTrigger>
      <TabsTrigger 
        value="url" 
        className="flex items-center justify-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
      >
        <Link2 className="w-4 h-4" />
        <span className="hidden sm:inline">Image URL</span>
        <span className="sm:hidden">URL</span>
      </TabsTrigger>
    </div>
  );
};