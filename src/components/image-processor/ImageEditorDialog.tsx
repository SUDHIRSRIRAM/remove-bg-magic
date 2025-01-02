import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageEditorTools } from "./ImageEditorTools";
import { ImageAdjustments } from "./ImageAdjustments";
import { ScrollArea } from "../ui/scroll-area";

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
  if (!processedImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] flex flex-col p-0 gap-0 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between border-b">
          <DialogTitle>Image Editor</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="tools" className="h-full flex flex-col">
            <TabsList className="px-4 py-2 border-b justify-start">
              <TabsTrigger value="tools" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Tools
              </TabsTrigger>
              <TabsTrigger value="adjust" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Adjust
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <div className="p-4">
                <TabsContent value="tools" className="m-0">
                  <ImageEditorTools
                    processedImage={processedImage}
                    onImageUpdate={onImageUpdate}
                  />
                </TabsContent>
                <TabsContent value="adjust" className="m-0">
                  <ImageAdjustments
                    processedImage={processedImage}
                    onImageUpdate={onImageUpdate}
                  />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};