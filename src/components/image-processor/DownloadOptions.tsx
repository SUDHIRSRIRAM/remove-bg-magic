import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DownloadOptionsProps {
  onDownload: (format: string) => void;
  disabled?: boolean;
}

export const DownloadOptions = ({ onDownload, disabled }: DownloadOptionsProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Select defaultValue="png" onValueChange={onDownload} disabled={disabled}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="png">PNG (Transparent)</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
          <SelectItem value="webp">WebP</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        onClick={() => onDownload("png")} 
        disabled={disabled}
        className="bg-green-500 hover:bg-green-600"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
};