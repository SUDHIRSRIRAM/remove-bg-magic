import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface BackgroundOptionsProps {
  selectedBackground: string;
  customColor: string;
  customImageUrl: string;
  onBackgroundChange: (type: string) => void;
  onCustomColorChange: (color: string) => void;
  onCustomImageUrlChange: (url: string) => void;
}

export const BackgroundOptions = ({
  selectedBackground,
  customColor,
  customImageUrl,
  onBackgroundChange,
  onCustomColorChange,
  onCustomImageUrlChange,
}: BackgroundOptionsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Choose Background</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Button
          variant={selectedBackground === "transparent" ? "default" : "outline"}
          onClick={() => onBackgroundChange("transparent")}
          className="h-20"
        >
          Transparent
        </Button>
        <Button
          variant={selectedBackground === "white" ? "default" : "outline"}
          onClick={() => onBackgroundChange("white")}
          className="h-20 bg-white"
        >
          White
        </Button>
        <Button
          variant={selectedBackground === "black" ? "default" : "outline"}
          onClick={() => onBackgroundChange("black")}
          className="h-20 bg-black"
        >
          Black
        </Button>
      </div>

      <div className="mb-4">
        <Label htmlFor="custom-color">Custom Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            id="custom-color"
            value={customColor}
            onChange={(e) => {
              onCustomColorChange(e.target.value);
              onBackgroundChange("custom");
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="custom-image">Custom Image URL</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            id="custom-image"
            placeholder="https://example.com/image.jpg"
            value={customImageUrl}
            onChange={(e) => {
              onCustomImageUrlChange(e.target.value);
              onBackgroundChange("image");
            }}
          />
        </div>
      </div>
    </div>
  );
};