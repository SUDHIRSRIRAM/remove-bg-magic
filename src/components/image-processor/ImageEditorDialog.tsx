import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageEditor } from "./ImageEditor";

interface ImageEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  processedImage: string | null;
  onImageUpdate: (newImage: string) => void;
}

export const ImageEditorDialog = ({
  isOpen,
  onClose,
  processedImage,
  onImageUpdate,
}: ImageEditorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Advanced Image Editor</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="tools" className="h-full flex flex-col">
            <TabsList>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="adjust">Adjust</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto p-4">
              {processedImage && (
                <ImageEditor
                  processedImage={processedImage}
                  onImageUpdate={onImageUpdate}
                />
              )}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};